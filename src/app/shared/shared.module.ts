// Shared module for reusable components, directives, pipes
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GeminiService } from './service/gemini.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [
	],
	imports: [
		HeaderComponent,
		FooterComponent,
		CommonModule,
		RouterModule,
	],
	exports: [
		HeaderComponent,
		FooterComponent,
	],
	providers: [
		GeminiService
	]
})
export class SharedModule { }
