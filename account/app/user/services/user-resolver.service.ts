import { Injectable } from '@angular/core';
import {
    Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';

import { User, UserService } from './user.service';
import { HttpAuth } from '../../shared/services/httpauth.service';


@Injectable()
export class UserDetailResolver implements Resolve<User> {

    constructor(private us: UserService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<User> {
        return this.us.requestCurrentUser().toPromise().then(user => {
            if (user) {
                this.us.setCurrentUser(user);
                return user;
            } else { // User not found
                window.location.href = "/signin";
                return null;
            }
        },
            error => {
                window.location.href = "/signin";
                return null;
            }
        );
    }
}