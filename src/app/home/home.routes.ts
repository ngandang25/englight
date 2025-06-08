import { Routes } from "@angular/router";
import { HomePageComponent } from "./home-page/home-page.component";
import { AuthenGuard } from "../core/guard/authen.guard";
import { AppLayoutComponent } from "../shared/app-layout/app-layout.component";

export const homeRoutes: Routes = [
	{
		path: '',
		component: AppLayoutComponent,
		canActivate: [AuthenGuard],
		children: [
			{
				path: '',
				component: HomePageComponent
			}
		]
	}
];
