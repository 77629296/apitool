import { t, } from "@lingui/macro";
import { ArrowCounterClockwise, Plus } from "@phosphor-icons/react";
import { Button, Tooltip } from "@apitool/ui";

import { getSectionIcon } from "../shared/section-icon";

export const LayoutSection = () => {
  const onAddPage = () => {
  };

  const onResetLayout = () => {
  };

  return (
    <section id="layout" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("layout")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Layout`}</h2>
        </div>

        <Tooltip content={t`Reset Layout`}>
          <Button size="icon" variant="ghost" onClick={onResetLayout}>
            <ArrowCounterClockwise />
          </Button>
        </Tooltip>
      </header>

      <main className="grid gap-y-4">
        <Button variant="outline" className="ml-auto" onClick={onAddPage}>
          <Plus />
          <span className="ml-2">{t`Add New Page`}</span>
        </Button>
      </main>
    </section>
  );
};
