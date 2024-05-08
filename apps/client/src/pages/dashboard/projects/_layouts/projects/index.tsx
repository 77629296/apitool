import { sortByDate } from "@apitool/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useProjects } from "@/client/services/project";

import { BaseCard } from "./_components/base-card";
import { CreateProjectCard } from "./_components/create-card";
import { ProjectCard } from "./_components/project-card";

export const Projects = () => {
  const { projects, loading } = useProjects();

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
        <CreateProjectCard />
      </motion.div>

      {loading &&
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseCard />
          </div>
        ))}

      {projects && (
        <AnimatePresence>
          {projects
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((project, index) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
