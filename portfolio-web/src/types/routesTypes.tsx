import { ReactNode } from "react";

export type RouteTypes ={
    menuHeading: string;
    routeName: string;
    menuName: string;
    subMenuNames: any[];
    requiredRoles: string[];
    icon?: ReactNode;
};
