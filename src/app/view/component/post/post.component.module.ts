import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './post.component';

@NgModule({
  declarations: [PostComponent],
  exports: [PostComponent],

  imports: [
    CommonModule, 
    HttpClientModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class PostModule { }