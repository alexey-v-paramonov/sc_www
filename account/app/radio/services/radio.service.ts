import { Injectable } from '@angular/core';
import { HttpAuth } from '../../shared/services/httpauth.service';

export class Radio{
  constructor(public id: number, public title: string) {

  }
}

export interface RadioServer {
    ip: string,
    nodename: string,
    country: string,
    provider: string,
    available: Boolean
}

@Injectable()
export class RadioService {

    constructor(private httpauth: HttpAuth) {
    }

    public getServices(){
        return this.httpauth.get(API_BASE + '/radio_service/').map(res => res.json());
    }
   
}

@Injectable()
export class RadioServerService {

    constructor(private httpauth: HttpAuth) {
    }

    public getServers(){
        return this.httpauth.get(API_BASE + '/servers/').map(res => res.json());
    }
   
}