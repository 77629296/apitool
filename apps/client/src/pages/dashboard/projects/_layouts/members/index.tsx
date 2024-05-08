import { sortByDate } from "@apitool/utils";
import { AnimatePresence, motion } from "framer-motion";

import { useOrganizations } from "@/client/services/project";

import { BaseListItem } from "./_components/base-item";
import { CreateProjectListItem } from "./_components/create-item";
import { ProjectListItem } from "./_components/project-item";

export const Members = () => {
  const { organizations, loading } = useOrganizations();

  return (
    <div className="grid gap-y-2">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
        <CreateProjectListItem />
      </motion.div>

      {loading &&
        [...Array(4)].map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseListItem className="bg-secondary/40" />
          </div>
        ))}

      {organizations && (
        <AnimatePresence>
          {organizations
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <ProjectListItem project={project} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
