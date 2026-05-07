// types.ts

export interface Category {
    id: string;
    categoryName: string;
    categoryImagePath: string | null;
    isActive:boolean;
    _id?:string
  }
