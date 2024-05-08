import { t } from "@lingui/macro";
import {
  CircleNotch,
  CopySimple,
  FolderOpen,
  Lock,
  LockOpen,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
import { ProjectDto } from "@apitool/dto";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@apitool/ui";
import { cn } from "@apitool/utils";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useDialog } from "@/client/stores/dialog";

import { BaseCard } from "./base-card";

type Props = {
  project: ProjectDto;
};

export const ProjectCard = ({ project }: Props) => {
  const navigate = useNavigate();
  const { open } = useDialog<ProjectDto>("project");
  const { open: lockOpen } = useDialog<ProjectDto>("lock");

  const lastUpdated = dayjs().to(project.updatedAt);

  const onOpen = () => {
    navigate(`/builder/${project.id}`);
  };

  const onUpdate = () => {
    open("update", { id: "project", item: project });
  };

  const onDuplicate = () => {
    open("duplicate", { id: "project", item: project });
  };

  const onLockChange = () => {
    lockOpen(project.locked ? "update" : "create", { id: "lock", item: project });
  };

  const onDelete = () => {
    open("delete", { id: "project", item: project });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <BaseCard onClick={onOpen} className="space-y-0">
          <AnimatePresence presenceAffectsLayout>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CircleNotch
                size={64}
                weight="thin"
                opacity={0.5}
                className="animate-spin self-center justify-self-center"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {project.locked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm"
              >
                <Lock size={42} />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
              "bg-gradient-to-t from-background/80 to-transparent",
            )}
          >
            <h4 className="line-clamp-2 font-medium">{project.title}</h4>
            <p className="line-clamp-1 text-xs opacity-75">{t`Last updated ${lastUpdated}`}</p>
          </div>
        </BaseCard>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={onOpen}>
          <FolderOpen size={14} className="mr-2" />
          {t`Open`}
        </ContextMenuItem>
        <ContextMenuItem onClick={onUpdate}>
          <PencilSimple size={14} className="mr-2" />
          {t`Rename`}
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>
          <CopySimple size={14} className="mr-2" />
          {t`Duplicate`}
        </ContextMenuItem>
        {project.locked ? (
          <ContextMenuItem onClick={onLockChange}>
            <LockOpen size={14} className="mr-2" />
            {t`Unlock`}
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={onLockChange}>
            <Lock size={14} className="mr-2" />
            {t`Lock`}
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-error">
          <TrashSimple size={14} className="mr-2" />
          {t`Delete`}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
