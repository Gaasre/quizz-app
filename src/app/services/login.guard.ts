import { Injectable, Inject } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private router: Router, private userService: UserService) {
    }

    canActivate() {

        if (this.storage.get('token')) {
            this.router.navigate(['/public']);
            return false;
        }
        return true;
    }

}
