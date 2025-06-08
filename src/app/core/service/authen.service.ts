import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthenService {
    constructor(
        private http: HttpClient,
    ) { }

    isAuthenticated(): boolean {
        // Implement your authentication logic here
        // For example, check if a token exists in local storage
        if (typeof window === 'undefined') {
            return false;
        }
        const token = localStorage?.getItem('token');
        return !!token; // Returns true if token exists, false otherwise
    }

    login(username: string, password: string): Observable<any> {
        const endpointUrl = 'https://dummyjson.com/auth/login'; // Replace with your actual API URL

        return this.http.post(endpointUrl, { username, password });
    }

    logout(): void {
        localStorage?.removeItem('token');
    }

    getToken(): string | null {
        return localStorage?.getItem('token');
    }
}