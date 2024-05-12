import { t } from "@lingui/macro";
import {
  Label,
} from "@apitool/ui";

import { getSectionIcon } from "../shared/section-icon";

export const PageSection = () => {
  return (
    <section id="theme" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("page")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Page`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
        <div className="space-y-1.5">
          <Label>{t`Options`}</Label>
        </div>
      </main>
    </section>
  );
};
