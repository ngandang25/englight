import { AuthenGuard } from "../core/guard/authen.guard";
import { AppLayoutComponent } from "../shared/app-layout/app-layout.component";
import { GrammarComponent } from "./grammar/grammar.component";

export const grammarRoutes = [
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [AuthenGuard],
        children: [
            {
                path: '',
                component: GrammarComponent
            }
        ]
    }
];