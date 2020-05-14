import { Injectable, Inject } from '@angular/core';
import { NoTokenRequest } from './no_token_request.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { map } from 'rxjs/operators';
import { TokenRequest } from './token_request.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    User;
    tempAvatar;
    constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private http: NoTokenRequest,
        private tokenRequest: TokenRequest, private router: Router) {
    }

    public Login(user) {
        return this.http.Post(user, 'user/login').pipe(map((res: any) => {
            this.storage.set('token', res.token);
            this.tokenRequest.setAuthorization(res.token);
            return res;
        }));
    }

    public Signup(user) {
        return this.http.Post(user, 'user/signup').pipe(map((res: any) => {
            this.storage.set('token', res.token);
            this.tokenRequest.setAuthorization(res.token);
            return res;
        }));
    }

    public getUser() {
        return this.tokenRequest.get('user');
    }

    public Disconnect() {
        this.User = null;
        this.storage.remove('token');
        this.router.navigate(['/']);
    }

    public Avatar(data) {
        return this.tokenRequest.upload(data);
    }

    public connected() {
        return this.http.Get('connected');
    }

    public seenRules() {
        return this.tokenRequest.get('user/seen');
    }
}
