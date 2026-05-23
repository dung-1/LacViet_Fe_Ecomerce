import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddPostComponent } from './add-post.component';
import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  RichTextEditorModule,
} from '@syncfusion/ej2-angular-richtexteditor';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ComboBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { AppsharedModule } from '../../../shared/app-shared.module';

@NgModule({
  declarations: [AddPostComponent],
  exports: [AddPostComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppsharedModule,
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
