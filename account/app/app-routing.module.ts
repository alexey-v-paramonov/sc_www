import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from './shared/guards/logged-in.guard';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RadioComponent } from './radio/radio.component';
import { AndroidAppComponent } from './android_app/android_app.component';
import { iOsAppComponent } from './ios_app/ios_app.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SupportComponent } from './support/support.component';
import { BillingComponent } from './billing/billing.component';


const routes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [LoggedInGuard],
    },

    {
        path: 'radio', component: RadioComponent, canActivate: [LoggedInGuard],
    },
    {
        path: 'android_app', component: AndroidAppComponent, canActivate: [LoggedInGuard],
    },

    {
        path: 'ios_app', component: iOsAppComponent, canActivate: [LoggedInGuard],
    },

    {
        path: 'catalog', component: CatalogComponent, canActivate: [LoggedInGuard],
    },

    {
        path: 'support', component: SupportComponent, canActivate: [LoggedInGuard],
    },

    {
        path: 'billing', component: BillingComponent, canActivate: [LoggedInGuard],
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
