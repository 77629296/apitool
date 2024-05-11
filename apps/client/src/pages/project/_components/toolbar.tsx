import { t } from "@lingui/macro";
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  ClockClockwise,
  Hash,
  LineSegment,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { Button, Separator, Toggle, Tooltip } from "@apitool/ui";
import { motion } from "framer-motion";

import { useToast } from "@/client/hooks/use-toast";
import { useBuilderStore } from "@/client/stores/builder";
import { useProjectStore, useTemporalProjectStore } from "@/client/stores/project";

export const BuilderToolbar = () => {
  const { toast } = useToast();
  const setValue = useProjectStore((state) => state.setValue);
  const undo = useTemporalProjectStore((state) => state.undo);
  const redo = useTemporalProjectStore((state) => state.redo);
  const frameRef = useBuilderStore((state) => state.frame.ref);

  const pageOptions = useProjectStore((state) => state.project.data.metadata.page.options);

  const onZoomIn = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_IN" }, "*");
  const onZoomOut = () => frameRef?.contentWindow?.postMessage({ type: "ZOOM_OUT" }, "*");
  const onResetView = () => frameRef?.contentWindow?.postMessage({ type: "RESET_VIEW" }, "*");

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
          <Button size="icon" variant="ghost" className="rounded-none" onClick={onResetView}>
            <ClockClockwise />
          </Button>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" />

        <Tooltip content={t`Toggle Page Break Line`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.breakLine}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.breakLine", pressed);
            }}
          >
            <LineSegment />
          </Toggle>
        </Tooltip>

        <Tooltip content={t`Toggle Page Numbers`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.pageNumbers}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.pageNumbers", pressed);
            }}
          >
            <Hash />
          </Toggle>
        </Tooltip>
      </div>
    </motion.div>
  );
};
