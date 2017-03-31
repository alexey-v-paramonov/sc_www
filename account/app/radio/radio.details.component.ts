import { Component, OnInit, OnDestroy } from '@angular/core';
import { Radio, RadioService } from '../radio/services/radio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


@Component({
    templateUrl: './radio.details.component.html',
})
export class RadioDetailsComponent implements OnInit, OnDestroy {

    private sub: any;
    private inEditMode: boolean = false;
    private radioForm: FormGroup;
    //private radioLoaded: boolean = false;


    constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private radioService: RadioService) {

    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {

            let id = parseInt(params['id']);
            if (id) {
                this.inEditMode = true;
            }
            this.createRadioForm();

        });

    }
    createRadioForm() {
        this.radioForm = this.fb.group({
            'name': new FormControl('', [Validators.required]),
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
