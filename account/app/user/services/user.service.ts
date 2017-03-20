import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpAuth } from '../../shared/services/httpauth.service';

@Injectable()
export class UserService {
    private loggedIn = false;
    private userId:number = 0;

    constructor(private http: Http, private httpauth: HttpAuth) {
        this.loggedIn = !!localStorage.getItem('auth_token');
        this.userId = parseInt(localStorage.getItem('user_id'));
    }

   
    public getCurrentUser(){
        return this.httpauth.get(API_BASE + `/users/${this.userId}`)
        .map(res => res.json());
    }

    

    logout() {
        localStorage.removeItem('auth_token');
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}