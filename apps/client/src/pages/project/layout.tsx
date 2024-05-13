import { Panel, PanelGroup, PanelResizeHandle } from "@apitool/ui";
import { cn } from "@apitool/utils";

import { useBuilderStore } from "@/client/stores/builder";

import { LeftSidebar } from "./sidebars/left";

export const BuilderLayout = () => {
  const leftSetSize = useBuilderStore((state) => state.panel.left.setSize);

  const leftHandle = useBuilderStore((state) => state.panel.left.handle);
  return (
    <div className="relative size-full overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel
          minSize={20}
          maxSize={30}
          defaultSize={20}
          onResize={leftSetSize}
          className={cn("z-10 bg-background", !leftHandle.isDragging && "transition-[flex]")}
        >
          <LeftSidebar />
        </Panel>
        <PanelResizeHandle
          isDragging={leftHandle.isDragging}
          onDragging={leftHandle.setDragging}
        />
        <Panel>
          content
        </Panel>
      </PanelGroup>
    </div>
  );
};
