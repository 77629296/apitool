import { t } from "@lingui/macro";
import { v4 as uuidv4 } from 'uuid';
import { ProjectDto } from "@apitool/dto";
import { CustomSectionGroup, defaultSection, SectionKey } from "@apitool/schema";
import { removeItemInLayout } from "@apitool/utils";
import _set from "lodash.set";
import { temporal, TemporalState } from "zundo";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { debouncedUpdateProject } from "../services/project";

type ProjectStore = {
  project: ProjectDto;

  // Actions
  setValue: (path: string, value: unknown) => void;
};

export const useProjectStore = create<ProjectStore>()(
  temporal(
    immer((set) => ({
      project: {} as ProjectDto,
      setValue: (path, value) => {
        set((state) => {
          state.project.data = _set(state.project.data, path, value);
          debouncedUpdateProject(JSON.parse(JSON.stringify(state.project)));
        });
      },
    })),
    {
      limit: 100,
      wrapTemporal: (fn) => devtools(fn),
      partialize: ({ project }) => ({ project }),
    },
  ),
);

export const useTemporalProjectStore = <T>(
  selector: (state: TemporalState<Pick<ProjectStore, "project">>) => T,
  equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(useProjectStore.temporal, selector, equality);
