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

  // Custom Section Actions
  addSection: () => void;
  removeSection: (sectionId: SectionKey) => void;
};

export const useProjectStore = create<ProjectStore>()(
  temporal(
    immer((set) => ({
      project: {} as ProjectDto,
      setValue: (path, value) => {
        set((state) => {
          if (path === "visibility") {
            state.project.visibility = value as "public" | "private";
          } else {
            state.project.data = _set(state.project.data, path, value);
          }

          debouncedUpdateProject(JSON.parse(JSON.stringify(state.project)));
        });
      },
      addSection: () => {
        const section: CustomSectionGroup = {
          ...defaultSection,
          id: uuidv4(),
          name: t`Custom Section`,
          items: [],
        };

        set((state) => {
          const lastPageIndex = state.project.data.metadata.layout.length - 1;
          state.project.data.metadata.layout[lastPageIndex][0].push(`custom.${section.id}`);
          state.project.data = _set(state.project.data, `sections.custom.${section.id}`, section);

          debouncedUpdateProject(JSON.parse(JSON.stringify(state.project)));
        });
      },
      removeSection: (sectionId: SectionKey) => {
        if (sectionId.startsWith("custom.")) {
          const id = sectionId.split("custom.")[1];

          set((state) => {
            removeItemInLayout(sectionId, state.project.data.metadata.layout);
            delete state.project.data.sections.custom[id];

            debouncedUpdateProject(JSON.parse(JSON.stringify(state.project)));
          });
        }
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
