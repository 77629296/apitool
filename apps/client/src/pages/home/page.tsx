import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { Helmet } from "react-helmet-async";

import { HeroSection } from "./sections/hero";

export const HomePage = () => {
  const { i18n } = useLingui();

  return (
    <main className="relative isolate bg-background">
      <Helmet prioritizeSeoTags>
        <html lang={i18n.locale} />

        <title>
          {t`APITool`} - {t`A free and open-source project builder`}
        </title>

        <meta
          name="description"
          content="APITool is a locally deployable, frontend-backend integrated, and visual interface management platform."
        />
      </Helmet>

      <HeroSection />
    </main>
  );
};
