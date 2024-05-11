import { defaultSections } from "@apitool/schema";
import { RichInput } from "@apitool/ui";
import { cn } from "@apitool/utils";

import { useProjectStore } from "@/client/stores/project";

import { getSectionIcon } from "./shared/section-icon";
import { SectionOptions } from "./shared/section-options";

export const SummarySection = () => {
  const setValue = useProjectStore((state) => state.setValue);
  const section = useProjectStore(
    (state) => state.project.data.sections.summary ?? defaultSections.summary,
  );

  return (
    <section id="summary" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("summary")}
          <h2 className="line-clamp-1 text-3xl font-bold">{section.name}</h2>
        </div>

        <div className="flex items-center gap-x-2">
          <SectionOptions id="summary" />
        </div>
      </header>

      <main className={cn(!section.visible && "opacity-50")}>
        <RichInput
          content={section.content}
          onChange={(value) => setValue("sections.summary.content", value)}
        />
      </main>
    </section>
  );
};
