


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
    ROUTER_BINDINGS,
    Router
    
     
    

} from '@angular/router-deprecated';


import {TabMenu,MenuItem} from 'primeng/primeng';

@Component({
    selector: 'admin',
    directives: [ROUTER_DIRECTIVES,TabMenu],
    providers:[AuthService],
    template: `
    <div style="padding-left:5px;">
    <p-tabMenu [model]="items"></p-tabMenu>
    </div>
    <div style="padding-left:5px;padding-top:25px;">
    <router-outlet></router-outlet>
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
    
    private items: MenuItem[];

    
    constructor( private router: Router,private authService: AuthService) {
    this.items = [
            {label: 'Home', icon: 'fa-file-home',url: ['AdminHome']},
            {label: 'Customers', icon: 'fa-file-audio-o',url: ['CustomerAccountList']},
            {label: 'Users', icon: 'fa-users',url: ['UserApplicationList']},
            {label: 'Mobile Prompts', icon: 'fa-volume-up',url: ['MobilePromptList']},
            {label: 'File Importer', icon: 'fa-upload',url: ['FileImporter']},
            {label: 'Geo-coder', icon: 'fa-globe',url: ['Geocoder']},
            {label: 'Log-off', icon: 'fa-sign-out',command: (event) => {
                localStorage.removeItem("id_token");
                this.authService.navigateTo('/Login');
            }}
        ];    
    }
    
    
    
   
    
}





