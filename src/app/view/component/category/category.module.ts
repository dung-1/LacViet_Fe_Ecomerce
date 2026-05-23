import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CategoryComponent } from './category.component';
import { AppsharedModule } from '../../shared/app-shared.module';

@NgModule({
  declarations: [CategoryComponent],
  exports: [CategoryComponent],
  imports: [CommonModule, HttpClientModule, AppsharedModule],
})
export class CategoryModule {}
