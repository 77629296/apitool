import { t } from "@lingui/macro";

import { getSectionIcon } from "../shared/section-icon";

export const NotesSection = () => {
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
      </main>
    </section>
  );
};
