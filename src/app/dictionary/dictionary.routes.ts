import { Routes } from "@angular/router";
import { DictionaryComponent } from "./dictionary/dictionary.component";
import { AuthenGuard } from "../core/guard/authen.guard";
import { AppLayoutComponent } from "../shared/app-layout/app-layout.component";

export const dictonaryRoutes: Routes = [
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthenGuard],
        children: [
            {
                path: '',
                component: DictionaryComponent
            }
        ]
    }
];
