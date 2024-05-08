import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { ProjectDto } from "@apitool/dto";
import { KeyboardShortcut } from "@apitool/ui";

import { useDialog } from "@/client/stores/dialog";

import { BaseListItem } from "./base-item";

export const CreateProjectListItem = () => {
  const { open } = useDialog<ProjectDto>("project");

  return (
    <BaseListItem
      start={<Plus size={18} />}
      onClick={() => open("create")}
      title={
        <>
          <span>{t`Create a new project`}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^N</KeyboardShortcut>
        </>
      }
      description={t`Start building from scratch`}
    />
  );
};
