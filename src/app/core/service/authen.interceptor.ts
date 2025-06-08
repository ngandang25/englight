import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenService } from './authen.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = inject(AuthenService).getToken();

        if (authToken) {
            // If we have a token, we set it to the header
            // req = req.clone({
            //     setHeaders: { Authorization: `Bearer ${authToken}` }
            // });
        }


        return next.handle(req).pipe(
            catchError((err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        inject(Router).navigate(['/login']);
                    }
                }
                return throwError(err);
            })
        )

    }
}