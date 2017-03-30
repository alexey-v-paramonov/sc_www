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
        children: [
            {
                path: 'radio', component: RadioComponent,
            },
            {
                path: 'android_app', component: AndroidAppComponent,
            },

            {
                path: 'ios_app', component: iOsAppComponent,
            },

            {
                path: 'catalog', component: CatalogComponent,
            },

            {
                path: 'support', component: SupportComponent,
            },

            {
                path: 'billing', component: BillingComponent,
            },

        ]
    },

    { path: '**', redirectTo: '/', pathMatch: 'full' },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
