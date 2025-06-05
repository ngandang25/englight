import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dictonaryRoutes } from './dictionary.routes';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(dictonaryRoutes),
    HttpClientModule
  ]
})
export class DictionaryModule { }
