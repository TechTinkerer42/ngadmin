

import {bootstrap}  from '@angular/platform-browser-dynamic';
import {Component, provide, Inject} from '@angular/core';
import {HttpHelper} from './common/service/http-helper';
import {CommonService} from './common/service/common-service';



import {UserApplicationList} from './Users/component/user-application-list';
import {CustomerAccountList} from './CustomerAccount/component/customer-account-list';
import {MobilePromptList} from './MobilePrompts/component/mobile-prompt-list';
import {FileImporter} from './Importer/component/file-importer';
import {Geocoder} from './Geocoder/component/geocoder-main';

import {LoginComponent} from './login/component/login-component';
import {appInjector} from './common/service/app-injector';


import {HTTP_PROVIDERS} from '@angular/http';

import { 
    ROUTER_DIRECTIVES, 
    ROUTER_PROVIDERS, 
    ROUTER_PRIMARY_COMPONENT, 
    RouteConfig,
    Router
    

} from '@angular/router-deprecated';


import {
    APP_BASE_HREF,
    HashLocationStrategy,
    PathLocationStrategy,
    LocationStrategy
} from '@angular/common'; 

import {enableProdMode} from '@angular/core';
//enableProdMode();



@Component({
    selector: 'app',
    directives: [ROUTER_DIRECTIVES],
    template: `
    <div class="row">
        <div class="col-md-2">
            <ul id="sample-menu-3" class="sf-menu sf-vertical">
                <li>
                    <a [routerLink]="['CustomerAccountList']">Customers</a>
                </li>
                <li>
                    <a [routerLink]="['UserApplicationList']">Users</a>
                </li>
                <li>
                    <a [routerLink]="['MobilePromptList']">Mobile Prompts</a>
                </li>
                <li>
                    <a [routerLink]="['FileImporter']">File Importer</a>
                </li>
                <li>
                    <a [routerLink]="['Geocoder']">Geo-coder</a>
                </li>
                
             </ul>
        </div>
        <div class="col-md-9">
            <router-outlet></router-outlet>
        </div>
    </div>
    `
})


        

@RouteConfig([
    { path: '/customeraccountlist', name: 'CustomerAccountList', component: CustomerAccountList },
    { path: '/userapplicationlist', name: 'UserApplicationList', component: UserApplicationList},
    { path: '/mobilepromptslist', name: 'MobilePromptList', component: MobilePromptList },
    { path: '/fileimport/', name: 'FileImporter', component: FileImporter },
    { path: '/geocoder/', name: 'Geocoder', component: Geocoder },
    { path: '/login/', name: 'Login', component: LoginComponent },
        
        
])


export class Main  {

    constructor( @Inject(Router) private router: Router) {
        
    }

    
}


bootstrap(Main, [
    HttpHelper,
    CommonService,
    //AuthService,
    HTTP_PROVIDERS,
    //AUTH_PROVIDERS,
    ROUTER_PROVIDERS,
    provide(ROUTER_PRIMARY_COMPONENT, { useValue: Main }),
    provide(APP_BASE_HREF, { useValue: '/' }),
    provide(LocationStrategy, { useClass: HashLocationStrategy })
])
.then((appRef: any) => {
  // store a reference to the application injector
  appInjector(appRef.injector);
})
.catch((err: any) => console.error("*" + err));



