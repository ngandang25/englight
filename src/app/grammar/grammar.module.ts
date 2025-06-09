import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { grammarRoutes } from './grammer.routes';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(grammarRoutes)
  ]
})
export class GrammarModule { }
