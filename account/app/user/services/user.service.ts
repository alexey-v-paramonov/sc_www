import { Injectable } from '@angular/core';
import { HttpAuth } from '../../shared/services/httpauth.service';

export class User{
  constructor(public id: number, public username: string) {

  }
}

@Injectable()
export class UserService {
    
    private loggedIn = false;
    private user:User;

    constructor(private httpauth: HttpAuth) {
        this.loggedIn = !!localStorage.getItem('auth_token');
    }

    public requestCurrentUser(){
        return this.httpauth.get(API_BASE + '/users/').map(res => res.json());
    }
   
    public getCurrentUser(){
        return this.user;
    }

    public setCurrentUser(u: User){
        return this.user = u;
    }
    

    logout() {
        localStorage.removeItem('auth_token');
        delete this.loggedIn;
        delete this.user;
    }

    isLoggedIn() {
        return this.loggedIn;
    }
}