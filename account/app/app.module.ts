import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
//import { HttpModule, BaseRequestOptions, RequestOptions }    from '@angular/http';
import { HttpModule } from '@angular/http';


import { AppRoutingModule } from './app-routing.module';
import { UserService } from './user/services/user.service';
import { LoggedInGuard } from './shared/guards/logged-in.guard';
import { HttpAuth } from './shared/services/httpauth.service';

import { HomeComponent } from './home/home.component';
import { RadioComponent } from './radio/radio.component';
import { AndroidAppComponent } from './android_app/android_app.component';
import { iOsAppComponent } from './ios_app/ios_app.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SupportComponent } from './support/support.component';
import { BillingComponent } from './billing/billing.component';


@NgModule({
  imports:      [ 
      BrowserModule,
      AppRoutingModule,
      HttpModule
  ],
  declarations: [ 
      AppComponent,
      HomeComponent,
      RadioComponent,
      AndroidAppComponent,
      iOsAppComponent,
      CatalogComponent,
      SupportComponent,
      BillingComponent
  ],
  providers: [                                                                                                                                                                                                                                                
    UserService,                                                                                                                                                                                                                                          
    LoggedInGuard,                                                                                                                                                                                                                                            
    HttpAuth,                                                                                                                                                                                                                                                 
  ], 
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
