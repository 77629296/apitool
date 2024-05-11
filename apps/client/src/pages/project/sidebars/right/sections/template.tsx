import { t } from "@lingui/macro";
import { AspectRatio } from "@apitool/ui";
import { cn, templatesList } from "@apitool/utils";
import { motion } from "framer-motion";

import { useProjectStore } from "@/client/stores/project";

import { getSectionIcon } from "../shared/section-icon";

export const TemplateSection = () => {
  const setValue = useProjectStore((state) => state.setValue);
  const currentTemplate = useProjectStore((state) => state.project.data.metadata.template);

  return (
    <section id="template" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("template")}
          <h2 className="line-clamp-1 text-3xl font-bold">{t`Template`}</h2>
        </div>
      </header>

      <main className="grid grid-cols-2 gap-5 @lg/right:grid-cols-3 @2xl/right:grid-cols-4">
        {templatesList.map((template, index) => (
          <AspectRatio key={template} ratio={1 / 1.4142}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: index * 0.1 } }}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              onClick={() => setValue("metadata.template", template)}
              className={cn(
                "relative cursor-pointer rounded-sm ring-primary transition-all hover:ring-2",
                currentTemplate === template && "ring-2",
              )}
            >
              <img src={`/templates/jpg/${template}.jpg`} alt={template} className="rounded-sm" />

              <div className="absolute inset-x-0 bottom-0 h-32 w-full bg-gradient-to-b from-transparent to-background/80">
                <p className="absolute inset-x-0 bottom-2 text-center font-bold capitalize text-primary">
                  {template}
                </p>
              </div>
            </motion.div>
          </AspectRatio>
        ))}
      </main>
    </section>
  );
};
