import { t } from "@lingui/macro";
import { ProjectDto } from "@apitool/dto";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@apitool/ui";

import { useLockProject } from "@/client/services/project/lock";
import { useDialog } from "@/client/stores/dialog";

export const LockDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<ProjectDto>("lock");

  const isLockMode = mode === "create";
  const isUnlockMode = mode === "update";

  const { lockProject, loading } = useLockProject();

  const onSubmit = async () => {
    if (!payload.item) return;

    await lockProject({ id: payload.item.id, set: isLockMode });

    close();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isLockMode && t`Are you sure you want to lock this project?`}
            {isUnlockMode && t`Are you sure you want to unlock this project?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isLockMode &&
              t`Locking a project will prevent any further changes to it. This is useful when you have already shared your project with someone and you don't want to accidentally make any changes to it.`}
            {isUnlockMode && t`Unlocking a project will allow you to make changes to it again.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
          <AlertDialogAction variant="info" disabled={loading} onClick={onSubmit}>
            {isLockMode && t`Lock`}
            {isUnlockMode && t`Unlock`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
