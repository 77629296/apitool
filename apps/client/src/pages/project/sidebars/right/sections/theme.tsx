import { t } from "@lingui/macro";
import { Input, Label, Popover, PopoverContent, PopoverTrigger } from "@apitool/ui";
import { cn } from "@apitool/utils";
import { HexColorPicker } from "react-colorful";

import { colors } from "@/client/constants/colors";
import { useProjectStore } from "@/client/stores/project";

import { getSectionIcon } from "../shared/section-icon";

export const ThemeSection = () => {
  const setValue = useProjectStore((state) => state.setValue);

  return (
    <section id="theme" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("theme")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Theme`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
      </main>
    </section>
  );
};
