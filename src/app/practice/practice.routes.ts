import { Routes } from "@angular/router";
import { PracticeComponent } from "./practice/practice.component";
import { AuthenGuard } from "../core/guard/authen.guard";
import { AppLayoutComponent } from "../shared/app-layout/app-layout.component";

export const practiveRoutes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthenGuard],
        children: [
            {
                path: '',
                component: PracticeComponent
            }
        ]
    }
];
