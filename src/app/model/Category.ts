
export interface Category {
    id: number;
    name: string;
    parentCategoryId?: number;
    modifiedTime?: string;
    children?: Category[];
  }