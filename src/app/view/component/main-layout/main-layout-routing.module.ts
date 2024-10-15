import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { CategoryComponent } from '../category/category.component';
import { ProductComponent } from '../product/product.component';
import { PostComponent } from '../post/post.component';
import { AddPostComponent } from '../post/add-post/add-post.component';
import { EditPostComponent } from '../post/edit-post/edit-post.component';


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'category',
        component: CategoryComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'post',
        component: PostComponent,
      },
      {
        path: 'post/create',
        component: AddPostComponent,
      },
      {
        path: 'post/edit/:id',
        component: EditPostComponent,
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  providers: [],
  exports: [RouterModule],
})
export class MainLayoutRoutingModule {}