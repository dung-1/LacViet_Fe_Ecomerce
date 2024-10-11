export interface Post {
    id: number;
    name: string;
    price: number;
    image:string;
    categoryId:number;
    modifiedTime?: string;
  }