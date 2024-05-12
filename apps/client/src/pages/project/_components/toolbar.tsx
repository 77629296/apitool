import { t } from "@lingui/macro";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ClockClockwise,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { Button, Separator, Tooltip } from "@apitool/ui";
import { motion } from "framer-motion";

import { useBuilderStore } from "@/client/stores/builder";
import { useTemporalProjectStore } from "@/client/stores/project";

export const BuilderToolbar = () => {
  const undo = useTemporalProjectStore((state) => state.undo);
  const redo = useTemporalProjectStore((state) => state.redo);
  const frameRef = useBuilderStore((state) => state.frame.ref);

  const onZoomIn = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_IN" }, "*");
  const onZoomOut = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_OUT" }, "*");

  return (
    <motion.div className="fixed inset-x-0 bottom-0 mx-auto hidden py-6 text-center md:block">
      <div className="inline-flex items-center justify-center rounded-full bg-background px-4 shadow-xl">
        <Tooltip content={t`Undo`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={() => undo()}>
            <ArrowCounterClockwise />
          </Button>
        </Tooltip>

        <Tooltip content={t`Redo`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={() => redo()}>
            <ArrowClockwise />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Zoom In`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onZoomIn}>
            <MagnifyingGlassPlus />
          </Button>
        </Tooltip>

        <Tooltip content={t`Zoom Out`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onZoomOut}>
            <MagnifyingGlassMinus />
          </Button>
        </Tooltip>

        <Tooltip content={t`Reset Zoom`}>
          <Button size="icon" variant="ghost" className="rounded-none" onClick={() => {}}>
            <ClockClockwise />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />
      </div>
    </motion.div>
  );
};
