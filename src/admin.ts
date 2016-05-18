


import {Component} from '@angular/core';

import {UserApplicationList} from './Users/component/user-application-list';
import {CustomerAccountList} from './CustomerAccount/component/customer-account-list';
import {MobilePromptList} from './MobilePrompts/component/mobile-prompt-list';
import {FileImporter} from './Importer/component/file-importer';
import {Geocoder} from './Geocoder/component/geocoder-main';
import {BlankComponent} from './common/component/blank-component'
import {AuthService} from './common/service/auth-service';

import { 
    ROUTER_DIRECTIVES, 
    ROUTER_PROVIDERS, 
    ROUTER_PRIMARY_COMPONENT, 
    RouteConfig,
    Router
    
     
    

} from '@angular/router-deprecated';





@Component({
    selector: 'admin',
    directives: [ROUTER_DIRECTIVES],
    providers:[AuthService],
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
                <li>
                    <a (click)="logoffUser();">Log-Off</a>
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
    { path: '/', name: 'AdminHome', component: BlankComponent,useAsDefault: true },
])


export class Admin   {
    
    constructor( private router: Router,private authService: AuthService) {
        
    }
    
    logoffUser(){
        localStorage.removeItem("id_token");
        this.authService.navigateTo('/Login');
        
    }
    
   
    
}





