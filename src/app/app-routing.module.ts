import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainLayoutModule } from './view/component/main-layout/main-layout.module';



const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import('./view/component/main-layout/main-layout.module').then(m => m.MainLayoutModule),
  },
];
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    NgbModule,
    MainLayoutModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}