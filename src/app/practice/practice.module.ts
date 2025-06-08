import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { practiveRoutes } from './practice.routes';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(practiveRoutes),
  ]
})
export class PracticeModule { }
