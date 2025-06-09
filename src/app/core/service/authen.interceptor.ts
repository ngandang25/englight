import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenService } from './authen.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authenService: AuthenService,
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authenService.getToken();

        if (authToken && req.url.includes('dummyjson.com')) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${authToken}` }
            });
        }


        return next.handle(req).pipe(
            catchError((err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        localStorage.removeItem('authToken');
                        this.router.navigate(['/login']);
                    }
                }
                return throwError(err);
            })
        )

    }
}