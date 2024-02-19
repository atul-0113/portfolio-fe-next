import { RxDashboard } from "react-icons/rx";
import { LuLayoutPanelTop } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";

export const AdminRoutes = [
    {
        menuHeading: "Menu",
        routeName: "/",
        menuName: "Dashboard",
        subMenuNames: [
            
        ],
        icon: <RxDashboard size={20}/>,
    },
    {
        menuHeading: "",
        routeName: "/category",
        menuName: "Category",
        subMenuNames: [],
        icon: <MdOutlineCategory size={20} />,
    },
    {
        menuHeading: "",
        routeName: "/templates",
        menuName: "Templates",
        subMenuNames: [],
        icon:<LuLayoutPanelTop size={20} /> ,
    },
    {
        menuHeading: "Configs",
        routeName: "/user-management",
        menuName: "User Management",
        subMenuNames: [],
        icon:<MdManageAccounts size={20} />,
    },
    {
        menuHeading: "",
        routeName: "/ui/buttons",
        menuName: "Button",
        subMenuNames: [],
        icon:<MdManageAccounts size={20} />,
    }
]