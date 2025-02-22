"use client";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import TableOne from "@/components/Tables/TableOne";
import TableThree from "@/components/Tables/TableThree";
import DataTable from "@/components/Tables/DataTable";

const Portfolios = () => {
  const portfolioData = [
    {
      name: "Portfolio 1",
      link: "/portfolio/1",
      category: "Web Development",
      template_name: "Template A",
      markinactive: "No",
      lastsubscribed: "2023-10-25",
      subscription_data: "Monthly",
    },
    {
      name: "Portfolio 2",
      link: "/portfolio/2",
      category: "Graphic Design",
      template_name: "Template B",
      markinactive: "Yes",
      lastsubscribed: "2023-10-24",
      subscription_data: "Yearly",
    },
    {
      name: "Portfolio 3",
      link: "/portfolio/3",
      category: "Photography",
      template_name: "Template C",
      markinactive: "No",
      lastsubscribed: "2023-10-23",
      subscription_data: "Monthly",
    },
    {
      name: "Portfolio 4",
      link: "/portfolio/4",
      category: "Web Development",
      template_name: "Template D",
      markinactive: "Yes",
      lastsubscribed: "2023-10-22",
      subscription_data: "Yearly",
    },
    {
      name: "Portfolio 5",
      link: "/portfolio/5",
      category: "Graphic Design",
      template_name: "Template E",
      markinactive: "No",
      lastsubscribed: "2023-10-21",
      subscription_data: "Monthly",
    },
    {
      name: "Portfolio 6",
      link: "/portfolio/6",
      category: "Photography",
      template_name: "Template F",
      markinactive: "Yes",
      lastsubscribed: "2023-10-20",
      subscription_data: "Yearly",
    },
    {
      name: "Portfolio 7",
      link: "/portfolio/7",
      category: "Web Development",
      template_name: "Template G",
      markinactive: "No",
      lastsubscribed: "2023-10-19",
      subscription_data: "Monthly",
    },
    {
      name: "Portfolio 8",
      link: "/portfolio/8",
      category: "Graphic Design",
      template_name: "Template H",
      markinactive: "Yes",
      lastsubscribed: "2023-10-18",
      subscription_data: "Yearly",
    },
    {
      name: "Portfolio 9",
      link: "/portfolio/9",
      category: "Photography",
      template_name: "Template I",
      markinactive: "No",
      lastsubscribed: "2023-10-17",
      subscription_data: "Monthly",
    },
    {
      name: "Portfolio 10",
      link: "/portfolio/10",
      category: "Web Development",
      template_name: "Template J",
      markinactive: "Yes",
      lastsubscribed: "2023-10-16",
      subscription_data: "Yearly",
    },
  ];
  const portfolioHeaders = [
    "Name",
    "Link",
    "Category",
    "Template Name",
    "MarkInactive",
    "LastSubscribed",
    "Subscription Data",
  ];
  const filterOptions = {
    category: ["Web Development", "Graphic Design", "Photography"],
    markinactive: ["Yes", "No"],
    subscription_data: ["Monthly", "Yearly"],
  };
  return (
    <DefaultLayout>
      <h1 className="mb-5 text-3xl font-bold">Portfolios</h1>
      <DataTable
        headers={portfolioHeaders}
        data={portfolioData}
        filterOptions={filterOptions}
      />
    </DefaultLayout>
  );
};

export default Portfolios;
