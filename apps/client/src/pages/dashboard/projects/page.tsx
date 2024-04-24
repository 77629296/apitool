import { t } from "@lingui/macro";
import { List, SquaresFour } from "@phosphor-icons/react";
import { ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from "@apitool/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import { Projects } from "./_layouts/projects";
import { Members } from "./_layouts/members";

type LayoutContent = "Projects" | "Members" | "Activities" | "Settings";

export const ProjectsPage = () => {
  const [layout, setLayout] = useState<LayoutContent>("Projects");

  return (
    <>
      <Helmet>
        <title>
          {t`Projects`} - {t`APITool`}
        </title>
      </Helmet>

      <Tabs
        value={layout}
        onValueChange={(value) => setLayout(value as Layout)}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            {t`WorkSpace`}
          </motion.h1>

          <TabsList>
            <TabsTrigger value="Projects" className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4">
              <span className="ml-2 hidden sm:block">{t`Projects`}</span>
            </TabsTrigger>
            <TabsTrigger value="Members" className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4">
              <span className="ml-2 hidden sm:block">{t`Members`}</span>
            </TabsTrigger>
            <TabsTrigger value="Activities" className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4">
              <span className="ml-2 hidden sm:block">{t`Activities`}</span>
            </TabsTrigger>
            <TabsTrigger value="Settings" className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4">
              <span className="ml-2 hidden sm:block">{t`Settings`}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)] lg:h-[calc(100vh-88px)]">
          <TabsContent value="Projects">
            <Projects />
          </TabsContent>
          <TabsContent value="Members">
            <Members />
          </TabsContent>
          <TabsContent value="Activities">
            Activities
          </TabsContent>
          <TabsContent value="Settings">
            Settings
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </>
  );
};
