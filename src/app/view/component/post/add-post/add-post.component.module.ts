import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { AddPostComponent } from './add-post.component';
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  RichTextEditorModule,
} from '@syncfusion/ej2-angular-richtexteditor';
import { TextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';

@NgModule({
  declarations: [AddPostComponent],
  exports: [AddPostComponent],

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
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PostAddModule {}
