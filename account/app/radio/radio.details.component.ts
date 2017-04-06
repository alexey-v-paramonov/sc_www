import { Component, OnInit, OnDestroy } from '@angular/core';
import { Radio, RadioServer, RadioService, RadioServerService } from '../radio/services/radio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
    templateUrl: './radio.details.component.html',
})
export class RadioDetailsComponent implements OnInit, OnDestroy {

    private sub: any;
    private inEditMode: boolean = false;
    private radioForm: FormGroup;
    public availableServers: Array<RadioServer> = [];
    //private radioLoaded: boolean = false;
    public HOSTING_TYPE = {
        SELF_HOSTED: 0,
        HOSTED: 1
    };

    public SELF_HOSTED_PAYMENT_TYPE = {
        ONETIME: 0,
        RECURRING: 1
    };

    private hostingTypes = [
        {
            id: this.HOSTING_TYPE.SELF_HOSTED,
            name: "Self-hosted"
        },
        {
            id: this.HOSTING_TYPE.HOSTED,
            name: "Hosted at streaming.center"
        }

    ];

    private billingTypes = [
        {
            id: this.SELF_HOSTED_PAYMENT_TYPE.ONETIME,
            name: "One-time payment"
        },
        {
            id: this.SELF_HOSTED_PAYMENT_TYPE.RECURRING,
            name: "Recurring payment"
        }

    ];
    
    public radio: any = {
        hosting: this.HOSTING_TYPE.HOSTED,
        billing: this.SELF_HOSTED_PAYMENT_TYPE.RECURRING
    };



    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private radioService: RadioService,
        private radioServerService: RadioServerService) {

    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {

            let id = parseInt(params['id']);
            if (id) {
                this.inEditMode = true;
            }
            this.createRadioForm();

        });

        this.radioServerService.getServers().subscribe(
            (servers) => {
                this.availableServers = servers;
                if(servers && servers.length > 0){
                    this.radioForm.controls['server'].setValue(servers[0].id);
                }

            },
            (e) => {
                console.log("Error loading available servers: ", e)
            }
        );


    }
    
    checkLoginAvaile(){
        console.log("Check login");
    }

    createRadioForm() {
        this.radioForm = this.fb.group({
            'name': new FormControl('', [Validators.required]),
            'hosting': new FormControl(this.radio.hosting, [Validators.required]),
            'billing': new FormControl(this.radio.billing, [Validators.required]),
            'ip': new FormControl('', [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]),
            'domain': new FormControl(''),
            'server':new FormControl(''),
            'login':new FormControl(''),
        });
    }

    onSubmit(form: any, event: Event) {

        form.submitted = true;
        event.preventDefault();
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}

