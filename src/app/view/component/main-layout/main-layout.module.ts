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
    IonicModule.forRoot(),

  ],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule {}