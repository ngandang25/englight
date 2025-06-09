import { Routes } from '@angular/router';
import { LoginComponent } from './profile/login/login.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
	},
	{
		path: 'dictionary',
		loadChildren: () => import('./dictionary/dictionary.module').then(m => m.DictionaryModule)
	},
	{
		path: 'practice',
		loadChildren: () => import('./practice/practice.module').then(m => m.PracticeModule)
	},
	{
		path: 'grammar',
		loadChildren: () => import('./grammar/grammar.module').then(m => m.GrammarModule)
	},
	{ path: 'login', component: LoginComponent },
];
