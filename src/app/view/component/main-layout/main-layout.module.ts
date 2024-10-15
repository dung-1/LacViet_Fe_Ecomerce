import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { AppsharedModule } from '../../shared/app-shared.module';
import { IonicModule } from '@ionic/angular';
import { PostModule } from '../post/post.component.module';
import { PostAddModule } from '../post/add-post/add-post.component.module';
import { PostEditModule } from '../post/edit-post/edit-post.component.module';


@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    MainLayoutRoutingModule,
    CategoryModule,
    ProductModule,
    AppsharedModule,
    PostModule,
    PostEditModule,
    PostAddModule,
    IonicModule.forRoot(),

  ],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule {}