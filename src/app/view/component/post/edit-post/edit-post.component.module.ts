import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EditPostComponent } from './edit-post.component';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';


@NgModule({
  declarations: [EditPostComponent],
  exports: [EditPostComponent],

  imports: [
    CommonModule,
    HttpClientModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    TabModule,
    TextBoxModule,
    RichTextEditorModule,
    DatePickerModule,
    UploaderModule,
    ButtonModule,
    ComboBoxModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class PostEditModule { }