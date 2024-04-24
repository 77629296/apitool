import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { KeyboardShortcut } from "@apitool/ui";
import { cn } from "@apitool/utils";

import { useDialog } from "@/client/stores/dialog";

import { BaseCard } from "./base-card";

export const CreateResumeCard = () => {
  const { open } = useDialog("resume");

  return (
    <BaseCard onClick={() => open("create")}>
      <Plus size={48} weight="thin" />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-3",
          "bg-gradient-to-t from-background/80 to-transparent",
        )}
      >
        <h4 className="font-medium">
          {t`Create project`}
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^N</KeyboardShortcut>
        </h4>

        <p className="text-xs opacity-75">{t`Start from scratch`}</p>
      </div>
    </BaseCard>
  );
};
