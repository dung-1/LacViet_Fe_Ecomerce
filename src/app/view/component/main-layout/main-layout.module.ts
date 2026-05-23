import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { AppsharedModule } from '../../shared/app-shared.module';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    LayoutModule,
    RouterModule,
    MainLayoutRoutingModule,
    CategoryModule,
    ProductModule,
    AppsharedModule,
  ],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule {}
