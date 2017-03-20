import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';


@Injectable()
export class HttpAuth {
    http: Http;

    constructor(http: Http, private router: Router) {
        this.http = http;
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Authorization', localStorage.getItem('auth_token'));
    }

    get(url: string) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(url, {
            headers: headers
        }).catch(this.catchAuthError(this));
    }

    delete(url: string) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(url, {
            headers: headers
        }).catch(this.catchAuthError(this));
    }

    post(url: string, data: any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(url, data, {
            headers: headers
        }).catch(this.catchAuthError(this));
    }

    put(url: string, data: any) {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(url, data, {
            headers: headers
        }).catch(this.catchAuthError(this));
    }

    private catchAuthError(self: HttpAuth) {
        // we have to pass HttpService's own instance here as `self`
        return (res: Response) => {
            console.log(res);
            if (res.status === 401 || res.status === 403) {
                // if not authenticated
                document.location.href = "/signin/";
            }
            return Observable.throw(res);
        };
    }

}