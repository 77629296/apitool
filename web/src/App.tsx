import { useEffect, useRef, useState } from "react";
import { GatewayClient } from "./gateway-client";
import "./App.css";

const WS_URL = import.meta.env.VITE_GATEWAY_URL ?? "ws://127.0.0.1:18790";

type SessionRow = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

type ChatMessage = {
  id?: string;
  role?: string;
  text?: string;
  ts?: number;
};

function readMessages(history: unknown): ChatMessage[] | null {
  if (!history || typeof history !== "object") return null;
  if ("code" in history && "message" in history) return null;
  const messages = (history as { messages?: unknown }).messages;
  return Array.isArray(messages) ? (messages as ChatMessage[]) : null;
}

export default function App() {
  const clientRef = useRef<GatewayClient | null>(null);
  const [connStatus, setConnStatus] = useState("idle");
  const [hello, setHello] = useState<unknown>(null);
  const [health, setHealth] = useState<unknown>(null);
  const [status, setStatus] = useState<unknown>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionDetail, setSessionDetail] = useState<unknown>(null);
  const [history, setHistory] = useState<unknown>(null);
  const [sessionError, setSessionError] = useState<unknown>(null);
  const [lastTick, setLastTick] = useState<string | null>(null);
  const [lastChat, setLastChat] = useState<unknown>(null);
  const [lastSessionsEvent, setLastSessionsEvent] = useState<unknown>(null);
  const [streamText, setStreamText] = useState("");
  const [activeRun, setActiveRun] = useState<{ sessionId: string; runId: string } | null>(null);
  const [busyIds, setBusyIds] = useState<Record<string, true>>({});
  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [chatText, setChatText] = useState("");
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;
  const titleDirtyRef = useRef(false);
  const streamRunRef = useRef<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const client = new GatewayClient({ url: WS_URL });
    clientRef.current = client;
    client.onStatus = setConnStatus;
    client.onHello = (payload) => {
      setHello(payload);
      void client.request("sessions.list").then((res) => {
        if (!res.ok) {
          setSessionError(res.error);
          return;
        }
        const list = res.payload as { sessions?: SessionRow[] };
        setSessions(list.sessions ?? []);
        setSessionError(null);
      });
    };
    client.onEvent = (event, payload) => {
      if (event === "tick") {
        const ts = (payload as { ts?: number } | undefined)?.ts;
        setLastTick(ts ? new Date(ts).toLocaleTimeString() : new Date().toLocaleTimeString());
        return;
      }
      if (event === "sessions") {
        setLastSessionsEvent(payload);
        const action = (payload as { action?: string; id?: string } | undefined)?.action;
        const deletedId = (payload as { id?: string } | undefined)?.id;
        if (action === "deleted" && deletedId && deletedId === selectedIdRef.current) {
          setSelectedId("");
          setSessionDetail(null);
          setHistory(null);
        }
        void client.request("sessions.list").then((res) => {
          if (!res.ok) {
            setSessionError(res.error);
            return;
          }
          const list = res.payload as { sessions?: SessionRow[] };
          setSessions(list.sessions ?? []);
          setSessionError(null);
        });
        return;
      }
      if (event === "chat.delta") {
        const p = payload as { sessionId?: string; runId?: string; text?: string } | undefined;
        if (!p?.sessionId) return;
        setBusyIds((prev) => (prev[p.sessionId!] ? prev : { ...prev, [p.sessionId!]: true }));
        if (p.sessionId !== selectedIdRef.current) return;
        if (typeof p.runId === "string" && p.runId !== streamRunRef.current) {
          streamRunRef.current = p.runId;
          setStreamText(typeof p.text === "string" ? p.text : "");
          return;
        }
        if (typeof p.text === "string") {
          setStreamText((prev) => prev + p.text);
        }
        return;
      }
      if (event === "chat") {
        setLastChat(payload);
        const p = payload as {
          sessionId?: string;
          runId?: string;
          aborted?: boolean;
          message?: { role?: string };
        } | undefined;
        const sessionId = p?.sessionId;
        const runDone = Boolean(p?.aborted || p?.message?.role === "assistant");
        if (sessionId && runDone) {
          setBusyIds((prev) => {
            if (!prev[sessionId]) return prev;
            const next = { ...prev };
            delete next[sessionId];
            return next;
          });
        }
        if (sessionId && sessionId === selectedIdRef.current) {
          // user message chat events only refresh history; leave streaming alone
          if (runDone) {
            streamRunRef.current = null;
            setStreamText("");
          }
          void client.request("chat.history", { sessionId }).then((res) => {
            setHistory(res.ok ? res.payload : res.error);
          });
        }
        setActiveRun((prev) => {
          if (!prev) return null;
          if (p?.runId && p.runId === prev.runId) return null;
          if (sessionId === prev.sessionId && runDone) {
            return null;
          }
          return prev;
        });
      }
    };
    client.connect();

    return () => {
      client.close();
      clientRef.current = null;
    };
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    streamRunRef.current = null;
    setStreamText("");
    setSessionDetail(null);
    titleDirtyRef.current = false;
    if (!selectedId || !client || connStatus !== "ready") {
      setHistory(null);
      setEditTitle("");
      return;
    }
    void client.request("chat.history", { sessionId: selectedId }).then((res) => {
      if (selectedIdRef.current !== selectedId) return;
      setHistory(res.ok ? res.payload : res.error);
    });
  }, [selectedId, connStatus]);

  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedSession) {
      if (!selectedId) setEditTitle("");
      return;
    }
    // auto-title / remote patch — only mirror when the user isn't mid-edit
    if (!titleDirtyRef.current) setEditTitle(selectedSession.title);
  }, [selectedSession, selectedId]);

  const messages = readMessages(history);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, streamText, selectedId]);

  async function call(method: "health" | "status") {
    const client = clientRef.current;
    if (!client) return;
    const res = await client.request(method);
    const value = res.ok ? res.payload : res.error;
    if (method === "health") setHealth(value);
    else setStatus(value);
  }

  async function refreshSessions() {
    const client = clientRef.current;
    if (!client) return;
    const res = await client.request("sessions.list");
    if (!res.ok) {
      setSessionError(res.error);
      return;
    }
    const payload = res.payload as { sessions?: SessionRow[] };
    setSessions(payload.sessions ?? []);
    setSessionError(null);
  }

  async function createSession() {
    const client = clientRef.current;
    if (!client) return;
    const res = await client.request("sessions.create", {
      title: title.trim() || undefined,
    });
    if (!res.ok) {
      setSessionError(res.error);
      return;
    }
    const payload = res.payload as { session?: SessionRow };
    if (payload.session) setSelectedId(payload.session.id);
    setTitle("");
    await refreshSessions();
  }

  async function getSession() {
    const client = clientRef.current;
    if (!client || !selectedId) return;
    const res = await client.request("sessions.get", { id: selectedId });
    if (!res.ok) {
      setSessionDetail(res.error);
      return;
    }
    setSessionDetail(res.payload);
    setSessionError(null);
  }

  async function removeSession(id = selectedId) {
    const client = clientRef.current;
    if (!client || !id) return;
    const res = await client.request("sessions.delete", { id });
    if (!res.ok) {
      setSessionError(res.error);
      return;
    }
    if (id === selectedIdRef.current) {
      setSelectedId("");
      setSessionDetail(null);
      setHistory(null);
    }
    setBusyIds((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setActiveRun((prev) => (prev?.sessionId === id ? null : prev));
    await refreshSessions();
  }

  async function renameSession() {
    const client = clientRef.current;
    const next = editTitle.trim();
    const current = sessions.find((s) => s.id === selectedId);
    if (!client || !selectedId || !next) return;
    if (current && next === current.title) {
      titleDirtyRef.current = false;
      return;
    }
    const res = await client.request("sessions.patch", {
      id: selectedId,
      title: next,
    });
    if (!res.ok) {
      setSessionError(res.error);
      return;
    }
    titleDirtyRef.current = false;
    await refreshSessions();
  }

  async function loadHistory() {
    const client = clientRef.current;
    if (!client || !selectedId) return;
    const res = await client.request("chat.history", { sessionId: selectedId });
    setHistory(res.ok ? res.payload : res.error);
  }

  async function sendChat() {
    const client = clientRef.current;
    if (!client || !selectedId || !chatText.trim()) return;
    if (activeRun?.sessionId === selectedId) return;
    const res = await client.request("chat.send", {
      sessionId: selectedId,
      role: "user",
      text: chatText.trim(),
    });
    if (!res.ok) {
      setHistory(res.error);
      return;
    }
    const payload = res.payload as { runId?: string | null } | undefined;
    if (typeof payload?.runId === "string") {
      streamRunRef.current = payload.runId;
      setActiveRun({ sessionId: selectedId, runId: payload.runId });
      setBusyIds((prev) => ({ ...prev, [selectedId]: true }));
      setStreamText("");
    }
    setChatText("");
    await loadHistory();
    await refreshSessions();
  }

  async function abortChat() {
    const client = clientRef.current;
    if (!client || !selectedId) return;
    const params =
      activeRun?.sessionId === selectedId
        ? { runId: activeRun.runId }
        : { sessionId: selectedId };
    const res = await client.request("chat.abort", params);
    if (!res.ok) {
      setSessionError(res.error);
    }
  }

  const ready = connStatus === "ready";
  const sessionBusy = Boolean(activeRun && activeRun.sessionId === selectedId);

  return (
    <main className="page">
      <header>
        <p className="brand">Mini-OpenClaw</p>
        <h1>Gateway</h1>
        <p className="sub">状态：{connStatus}</p>
        <p className="sub">最近 tick：{lastTick ?? "还没有"}</p>
        <p className="sub">最近 chat event：{lastChat ? "已收到" : "还没有"}</p>
        <p className="sub">最近 sessions event：{lastSessionsEvent ? "已收到" : "还没有"}</p>
      </header>

      <section>
        <h2>hello-ok</h2>
        <pre>{hello ? JSON.stringify(hello, null, 2) : "等待握手…"}</pre>
      </section>

      <section>
        <div className="actions">
          <button type="button" onClick={() => void call("status")} disabled={!ready}>
            调用 status
          </button>
          <button type="button" onClick={() => void call("health")} disabled={!ready}>
            调用 health
          </button>
        </div>
        <h2>status</h2>
        <pre>{status ? JSON.stringify(status, null, 2) : "尚未调用"}</pre>
        <h2>health</h2>
        <pre>{health ? JSON.stringify(health, null, 2) : "尚未调用"}</pre>
      </section>

      <section>
        <h2>sessions</h2>
        <div className="actions">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="session title"
            disabled={!ready}
          />
          <button type="button" onClick={() => void createSession()} disabled={!ready}>
            create
          </button>
          <button type="button" onClick={() => void refreshSessions()} disabled={!ready}>
            list
          </button>
        </div>
        <div className="actions">
          <button type="button" onClick={() => void getSession()} disabled={!ready || !selectedId}>
            get
          </button>
          <button
            type="button"
            onClick={() => void removeSession()}
            disabled={!ready || !selectedId}
          >
            delete
          </button>
        </div>
        {sessionError ? (
          <pre>{JSON.stringify(sessionError, null, 2)}</pre>
        ) : (
          <div className="session-list">
            {sessions.length === 0 ? (
              <p className="thread-empty">还没有 session</p>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className={`session-row${s.id === selectedId ? " session-row-active" : ""}`}
                >
                  <button
                    type="button"
                    className="session-select"
                    onClick={() => setSelectedId(s.id)}
                    disabled={!ready}
                  >
                    <span className="session-title">
                      {s.title}
                      {busyIds[s.id] ? <span className="session-busy">running</span> : null}
                    </span>
                    <span className="session-meta">
                      {s.id.slice(0, 8)} · {new Date(s.updatedAt).toLocaleString()}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="session-delete"
                    aria-label="delete session"
                    onClick={() => void removeSession(s.id)}
                    disabled={!ready}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        <h2>session detail</h2>
        <pre>{sessionDetail ? JSON.stringify(sessionDetail, null, 2) : "尚未调用"}</pre>
      </section>

      <section>
        <h2>chat</h2>
        {selectedId ? (
          <div className="chat-header">
            <input
              className="chat-title"
              value={editTitle}
              onChange={(e) => {
                titleDirtyRef.current = true;
                setEditTitle(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void renameSession();
                }
              }}
              onBlur={() => void renameSession()}
              placeholder="session title"
              disabled={!ready}
            />
            <span className="chat-id">{selectedId.slice(0, 8)}</span>
            {sessionBusy ? <span className="session-busy">running</span> : null}
          </div>
        ) : (
          <p className="thread-empty">先选一个 session</p>
        )}
        <div className="composer">
          <textarea
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendChat();
              }
            }}
            placeholder="message text · Enter 发送 · Shift+Enter 换行"
            rows={3}
            disabled={!ready || !selectedId || sessionBusy}
          />
          <div className="composer-actions">
            <button
              type="button"
              onClick={() => void sendChat()}
              disabled={!ready || !selectedId || !chatText.trim() || sessionBusy}
            >
              send
            </button>
            <button
              type="button"
              onClick={() => void abortChat()}
              disabled={!ready || !selectedId || !sessionBusy}
            >
              abort
            </button>
            <button
              type="button"
              onClick={() => void loadHistory()}
              disabled={!ready || !selectedId}
            >
              history
            </button>
          </div>
        </div>
        {messages ? (
          <div className="thread">
            {messages.length === 0 && !streamText ? (
              <p className="thread-empty">还没有消息</p>
            ) : null}
            {messages.map((m, i) => (
              <div key={m.id ?? `${m.role}-${m.ts ?? i}`} className={`msg msg-${m.role ?? "unknown"}`}>
                <div className="msg-meta">
                  <span className="msg-role">{m.role ?? "?"}</span>
                  {typeof m.ts === "number" ? (
                    <span className="msg-time">{new Date(m.ts).toLocaleTimeString()}</span>
                  ) : null}
                </div>
                <p className="msg-text">{m.text ?? ""}</p>
              </div>
            ))}
            {streamText ? (
              <div className="msg msg-assistant msg-streaming">
                <div className="msg-meta">
                  <span className="msg-role">assistant</span>
                </div>
                <p className="msg-text">{streamText}</p>
              </div>
            ) : null}
            <div ref={threadEndRef} />
          </div>
        ) : (
          <pre>{history ? JSON.stringify(history, null, 2) : "尚未调用"}</pre>
        )}
        <h2>last chat event</h2>
        <pre>{lastChat ? JSON.stringify(lastChat, null, 2) : "尚未收到"}</pre>
      </section>
    </main>
  );
}
