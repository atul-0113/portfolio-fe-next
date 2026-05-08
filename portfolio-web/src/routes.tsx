import { FaFileAlt, FaLayerGroup, FaUserTie } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { MdManageAccounts, MdOutlineCategory } from "react-icons/md";
import { RouteTypes } from "@/types/routesTypes";

export const AdminRoutes: RouteTypes[] = [
  {
    menuHeading: "Menu",
    routeName: "/dashboard",
    menuName: "Dashboard",
    subMenuNames: [],
    requiredRoles: ["USER", "ADMIN"],
    icon: <RxDashboard size={20} />,
  },
  {
    menuHeading: "Workspace",
    routeName: "/resume-builder",
    menuName: "Resume Builder",
    subMenuNames: [],
    requiredRoles: ["USER", "ADMIN"],
    icon: <FaFileAlt size={20} />,
  },
  {
    menuHeading: "",
    routeName: "/templates",
    menuName: "Template",
    subMenuNames: [],
    requiredRoles: ["USER", "ADMIN"],
    icon: <FaLayerGroup size={20} />,
  },
  {
    menuHeading: "",
    routeName: "/portfolios",
    menuName: "Portfolio",
    subMenuNames: [],
    requiredRoles: ["USER", "ADMIN"],
    icon: <FaUserTie size={20} />,
  },
  {
    menuHeading: "Admin",
    routeName: "/category",
    menuName: "Category",
    subMenuNames: [],
    requiredRoles: ["ADMIN"],
    icon: <MdOutlineCategory size={20} />,
  },
  {
    menuHeading: "",
    routeName: "/user-management",
    menuName: "User Management",
    subMenuNames: [],
    requiredRoles: ["ADMIN"],
    icon: <MdManageAccounts size={20} />,
  },
];
