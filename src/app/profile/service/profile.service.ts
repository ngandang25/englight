import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserInfo } from "../../shared/models/user-info.model";


@Injectable({ providedIn: 'root' })
export class ProfileService {
    constructor(
        private http: HttpClient,
    ) { }

    getUserProfile(): Observable<UserInfo> {
        const enpointApi = `https://dummyjson.com/auth/me`;
        return this.http.get<UserInfo>(enpointApi);
    }

}