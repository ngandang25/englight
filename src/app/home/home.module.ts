import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { homeRoutes } from './home.routes';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        RouterModule.forChild(homeRoutes),
        HttpClientModule,
    ],
    declarations: [],
    exports: [],
    providers: []
})
export class HomeModule { }
