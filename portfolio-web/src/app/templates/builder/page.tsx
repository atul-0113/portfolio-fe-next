"use client";

import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { PortfolioBuilder } from "@/portfolio-engine";
import { layoutStyles } from "@/styles/ui";

const PortfolioTemplateBuilderPage = () => (
  <DefaultLayout>
    <section className={`${layoutStyles.page} max-w-[1500px]`}>
      <PortfolioBuilder />
    </section>
  </DefaultLayout>
);

export default PortfolioTemplateBuilderPage;
