import { t } from "@lingui/macro";
import { RichInput } from "@apitool/ui";

import { useProjectStore } from "@/client/stores/project";

import { getSectionIcon } from "../shared/section-icon";

export const NotesSection = () => {
  const setValue = useProjectStore((state) => state.setValue);
  const notes = useProjectStore((state) => state.project.data.metadata.notes);

  return (
    <section id="notes" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("notes")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Notes`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
        <p className="leading-relaxed">
          {t`This section is reserved for your personal notes specific to this project. The content here remains private and is not shared with anyone else.`}
        </p>

        <div className="space-y-1.5">
          <RichInput content={notes} onChange={(content) => setValue("metadata.notes", content)} />

          <p className="text-xs leading-relaxed opacity-75">
            {t`For example, information regarding which companies you sent this project to or the links to the job descriptions can be noted down here.`}
          </p>
        </div>
      </main>
    </section>
  );
};
