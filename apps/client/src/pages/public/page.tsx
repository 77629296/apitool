import { t } from "@lingui/macro";
import { ProjectDto } from "@apitool/dto";
import { Button } from "@apitool/ui";
import { pageSizeMap } from "@apitool/utils";
import { useCallback, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, LoaderFunction, redirect, useLoaderData } from "react-router-dom";

import { Icon } from "@/client/components/icon";
import { ThemeSwitch } from "@/client/components/theme-switch";
import { queryClient } from "@/client/libs/query-client";
import { findProjectByUsernameSlug } from "@/client/services/project";

export const PublicProjectPage = () => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const { name, data: project } = useLoaderData() as ProjectDto;
  const format = project.metadata.page.format;

  const updateProjectInFrame = useCallback(() => {
    if (!frameRef.current || !frameRef.current.contentWindow) return;
    const message = { type: "SET_PROJECT", payload: project };
    (() => frameRef.current.contentWindow.postMessage(message, "*"))();
  }, [frameRef, project]);

  useEffect(() => {
    if (!frameRef.current) return;
    frameRef.current.addEventListener("load", updateProjectInFrame);
    return () => frameRef.current?.removeEventListener("load", updateProjectInFrame);
  }, [frameRef]);

  useEffect(() => {
    if (!frameRef.current || !frameRef.current.contentWindow) return;

    const handleMessage = (event: MessageEvent) => {
      if (!frameRef.current || !frameRef.current.contentWindow) return;
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "PAGE_LOADED") {
        frameRef.current.width = event.data.payload.width;
        frameRef.current.height = event.data.payload.height;
        frameRef.current.contentWindow.removeEventListener("message", handleMessage);
      }
    };

    frameRef.current.contentWindow.addEventListener("message", handleMessage);

    return () => {
      frameRef.current?.contentWindow?.removeEventListener("message", handleMessage);
    };
  }, [frameRef]);

  return (
    <div>
      <Helmet>
        <title>
          {name} - {t`APITool`}
        </title>
      </Helmet>

      <div
        style={{ width: `${pageSizeMap[format].width}mm` }}
        className="mx-auto mb-6 mt-16 overflow-hidden rounded shadow-xl print:m-0 print:shadow-none"
      >
        preview
      </div>

      <div className="flex justify-center py-10 opacity-50 print:hidden">
        <Link to="/">
          <Button size="sm" variant="ghost" className="space-x-1.5 text-xs font-normal">
            <span>{t`Built with`}</span>
            <Icon size={12} />
            <span>{t`APITool`}</span>
          </Button>
        </Link>
      </div>

      <div className="fixed bottom-5 right-5 print:hidden">
        <div className="flex items-center gap-x-4">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export const publicLoader: LoaderFunction<ProjectDto> = async ({ params }) => {
  try {
    const username = params.username as string;
    const slug = params.slug as string;

    const project = await queryClient.fetchQuery({
      queryKey: ["project", { username, slug }],
      queryFn: () => findProjectByUsernameSlug({ username, slug }),
    });

    return project;
  } catch (error) {
    return redirect("/");
  }
};
