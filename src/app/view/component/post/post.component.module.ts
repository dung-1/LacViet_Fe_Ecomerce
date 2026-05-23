import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PostComponent } from './post.component';
import { AppsharedModule } from '../../shared/app-shared.module';

@NgModule({
  declarations: [PostComponent],
  exports: [PostComponent],
  imports: [CommonModule, HttpClientModule, RouterModule, AppsharedModule],
})
export class PostModule {}
