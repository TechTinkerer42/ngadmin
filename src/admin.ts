


import {Component} from '@angular/core';

import {UserApplicationList} from './Users/component/user-application-list';
import {CustomerAccountList} from './CustomerAccount/component/customer-account-list';
import {MobilePromptList} from './MobilePrompts/component/mobile-prompt-list';
import {FileImporter} from './Importer/component/file-importer';
import {Geocoder} from './Geocoder/component/geocoder-main';
import {BlankComponent} from './common/component/blank-component'
import {TicketsList} from './Tickets/component/tickets-list'
import {AuthService} from './common/service/auth-service';
import {CommonService} from './common/service/common-service';

import {
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS,
    Routes,
    Router


} from '@angular/router';







import {MenuItem, TabMenu} from 'primeng/primeng';

@Component({
    selector: 'admin',
    directives: [ROUTER_DIRECTIVES, TabMenu],
    providers: [AuthService],
    template: `
    <div style="padding-left:5px;">
    <p-tabMenu [model]="items"></p-tabMenu>
    </div>
    <div style="padding-left:5px;padding-top:25px;">
    <router-outlet></router-outlet>
    </div>
    `
})




@Routes([
    { path: '/customeraccountlist', component: CustomerAccountList },
    { path: '/userapplicationlist', component: UserApplicationList },
    { path: '/mobilepromptslist', component: MobilePromptList },
    { path: '/fileimport', component: FileImporter },
    { path: '/geocoder', component: Geocoder },
    { path: '/tickets', component: TicketsList },
    { path: '/home', component: BlankComponent },
])


export class Admin {

    private items: any[];


    constructor(private authService: AuthService, private commonService: CommonService) {





        this.items = [
            { label: 'Home', icon: 'fa-file-home', routerLink: ['/admin/home'] },
            //{label: 'Customers', icon: 'fa-file-audio-o',routerLink: ['/admin/customeraccountlist']},
            //{label: 'Users', icon: 'fa-users',routerLink: ['/admin/userapplicationlist']},
            //{label: 'Mobile Prompts', icon: 'fa-volume-up',routerLink: ['/admin/mobilepromptslist']},
            //{label: 'File Importer', icon: 'fa-upload',routerLink: ['/admin/fileimport']},
            //{label: 'Geo-coder', icon: 'fa-globe',routerLink: ['/admin/geocoder']},
            //{label: 'Tickets', icon: 'fa-ticket',routerLink: ['/admin/tickets']},

            
        ];

        
        this.getMenuItems();




    }
    
    
    getMenuItems()
    {
        console.log('here');
        this.commonService.getAdminMenuItems()
            .subscribe(res => {
                (<any[]>res).forEach(x=> {
                    //console.log(x);
                    this.items.push({label: x.Label, icon: x.Icon,routerLink: [x.RouterLink]});
                    
                });
                
                this.items.push({label: 'Log-off', icon: 'fa-sign-out', command: (event) => {localStorage.removeItem("id_token");this.authService.navigateTo(['/']);}});

            },
            err => {
                console.log(err);
            }
            );
    }


}









