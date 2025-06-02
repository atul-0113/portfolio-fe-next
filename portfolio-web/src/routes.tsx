import { RxDashboard } from "react-icons/rx";
import { LuLayoutPanelTop } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { ImProfile } from "react-icons/im";

export const AdminRoutes = [
    {
        menuHeading: "Menu",
        routeName: "/",
        menuName: "Dashboard",
        subMenuNames: [],
        requiredRoles: ["ADMIN"],
        icon: <RxDashboard size={20}/>,
    },
    {
        menuHeading: "",
        routeName: "/category",
        menuName: "Category",
        subMenuNames: [],
        requiredRoles: ["ADMIN"],
        icon: <MdOutlineCategory size={20} />,
    },
    {
        menuHeading: "",
        routeName: "/templates",
        menuName: "Templates",
        subMenuNames: [],
        requiredRoles: ["ADMIN"],
        icon:<LuLayoutPanelTop size={20} /> ,
    },
    {
        menuHeading: "Configs",
        routeName: "/user-management",
        menuName: "User Management",
        subMenuNames: [],
        requiredRoles: ["ADMIN"],
        icon:<MdManageAccounts size={20} />,
    },
    {
        menuHeading: "",
        routeName: "/portfolios",
        menuName: "Portfolios",
        subMenuNames: [],
        requiredRoles: ["ADMIN"],
        icon:<ImProfile size={20} />,
    },
    {
        menuHeading: "",
        routeName: "/",
        menuName: "Portfolios",
        subMenuNames: [],
        requiredRoles: ["USER"],
        icon:<ImProfile size={20} />,
    },
]