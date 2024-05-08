import { t } from "@lingui/macro";
import { ProjectDto } from "@apitool/dto";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { LoaderFunction, redirect } from "react-router-dom";

import { queryClient } from "@/client/libs/query-client";
import { findProjectById } from "@/client/services/project";
import { useBuilderStore } from "@/client/stores/builder";
import { useProjectStore } from "@/client/stores/project";

export const BuilderPage = () => {
  const frameRef = useBuilderStore((state) => state.frame.ref);
  const setFrameRef = useBuilderStore((state) => state.frame.setRef);

  const project = useProjectStore((state) => state.project);
  const title = useProjectStore((state) => state.project.name);

  const updateProjectInFrame = useCallback(() => {
    if (!frameRef || !frameRef.contentWindow) return;
    const message = { type: "SET_PROJECT", payload: project.data };
    (() => frameRef.contentWindow.postMessage(message, "*"))();
  }, [frameRef, project.data]);

  // Send project data to iframe on initial load
  useEffect(() => {
    if (!frameRef) return;
    frameRef.addEventListener("load", updateProjectInFrame);
    return () => frameRef.removeEventListener("load", updateProjectInFrame);
  }, [frameRef]);

  // Send project data to iframe on change of project data
  useEffect(updateProjectInFrame, [project.data]);

  return (
    <>
      <Helmet>
        <title>
          {title} - {t`APITool`}
        </title>
      </Helmet>

      builder
    </>
  );
};

export const builderLoader: LoaderFunction<ProjectDto> = async ({ params }) => {
  try {
    const id = params.id as string;

    const project = await queryClient.fetchQuery({
      queryKey: ["project", { id }],
      queryFn: () => findProjectById({ id }),
    });

    useProjectStore.setState({ project });
    useProjectStore.temporal.getState().clear();

    return project;
  } catch (error) {
    return redirect("/dashboard");
  }
};
