import { Injectable } from '@angular/core';
import { HttpAuth } from '../../shared/services/httpauth.service';

export class Radio{
  constructor(public id: number, public title: string) {

  }
}

@Injectable()
export class RadioService {

    constructor(private httpauth: HttpAuth) {
    }

    public getServices(){
        return this.httpauth.get(API_BASE + '/radio_service/').map(res => res.json());
    }
   
}