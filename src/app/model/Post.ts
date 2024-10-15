export interface Post {
    id: number;
    title: string;
    content: string;
    categoryId: number;
    fromDate?: string;
    toDate?: string;
    excerptImage?: string;
    modifiedTime?: string;
  }