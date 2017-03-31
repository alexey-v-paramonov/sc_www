import { Component, OnInit } from '@angular/core';
import { Radio, RadioService } from '../radio/services/radio.service';

@Component({
    templateUrl: './service_list.component.html',
})

export class ServiceListComponent implements OnInit {

    radioServices: Array<Radio> = [];

    constructor(private radioService: RadioService) {                                                                                                                                                                                                           

    }

    
    ngOnInit(): void {
        this.radioService.getServices().subscribe(
            radioServices => {
                this.radioServices = radioServices;
            }
        )
    }

}
