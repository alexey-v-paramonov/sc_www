import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
//import { HttpModule, BaseRequestOptions, RequestOptions }    from '@angular/http';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Stuff
import { AppRoutingModule } from './app-routing.module';
import { LoggedInGuard } from './shared/guards/logged-in.guard';

// Components
import { HomeComponent } from './home/home.component';
import { ServiceListComponent } from './service_list/service_list.component';
import { RadioComponent } from './radio/radio.component';
import { RadioDetailsComponent } from './radio/radio.details.component';
import { AndroidAppComponent } from './android_app/android_app.component';
import { iOsAppComponent } from './ios_app/ios_app.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SupportComponent } from './support/support.component';
import { BillingComponent } from './billing/billing.component';

// Services
import { RadioService } from './radio/services/radio.service';
import { UserService } from './user/services/user.service';
import { HttpAuth } from './shared/services/httpauth.service';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,

    ],
    declarations: [
        AppComponent,
        HomeComponent,
        RadioComponent,
        RadioDetailsComponent,
        AndroidAppComponent,
        iOsAppComponent,
        CatalogComponent,
        SupportComponent,
        BillingComponent,
        ServiceListComponent
    ],
    providers: [
        UserService,
        LoggedInGuard,
        HttpAuth,
        RadioService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
