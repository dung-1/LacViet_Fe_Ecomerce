import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductComponent } from './product.component';
import { AppsharedModule } from '../../shared/app-shared.module';

@NgModule({
  declarations: [ProductComponent],
  exports: [ProductComponent],
  imports: [CommonModule, HttpClientModule, AppsharedModule],
})
export class ProductModule {}
