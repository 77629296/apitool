import { t } from "@lingui/macro";
import { ArrowRight } from "@phosphor-icons/react";
import { Badge, buttonVariants } from "@apitool/ui";
import { cn } from "@apitool/utils";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

import { defaultTiltProps } from "@/client/constants/parallax-tilt";

import { HeroCTA } from "./call-to-action";
import { Decoration } from "./decoration";

export const HeroSection = () => (
  <section id="hero" className="relative">
    <Decoration.Grid />
    <Decoration.Gradient />

    <div className="mx-auto max-w-7xl px-6 lg:flex lg:h-screen lg:items-center lg:px-12">
      <motion.div
        className="mx-auto mt-32 max-w-3xl shrink-0 lg:mx-0 lg:mt-0 lg:max-w-xl lg:pt-8"
        viewport={{ once: true }}
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
      >
        <div className="mt-10 space-y-2">
          <h6 className="text-base font-bold tracking-wide">{t`Finally,`}</h6>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t`A free and open-source platform.`}
          </h1>
        </div>

        <p className="prose prose-base prose-zinc mt-6 text-lg leading-8 dark:prose-invert">
          {t`APITool is a locally deployable, frontend-backend integrated, and visual interface management platform.`}
        </p>

        <div className="mt-10 flex items-center gap-x-8">
          <HeroCTA />
        </div>
      </motion.div>

      <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-20">
        <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Tilt {...defaultTiltProps}>
              <img
                width={700}
                height={826}
                src="/screenshots/splatoon.webp"
                alt="APITool - Screenshot - Builder Screen"
                className="w-[38rem] rounded-lg bg-background/5 shadow-2xl ring-1 ring-foreground/10"
              />
            </Tilt>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);
