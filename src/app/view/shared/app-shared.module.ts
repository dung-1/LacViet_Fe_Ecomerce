import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ConfirmDialogComponent,
    CategoryFormDialogComponent,
    ProductFormDialogComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    MaterialModule,
    ConfirmDialogComponent,
    CategoryFormDialogComponent,
    ProductFormDialogComponent,
  ],
})
export class AppsharedModule {}
