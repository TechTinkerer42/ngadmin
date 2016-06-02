

import {bootstrap}  from '@angular/platform-browser-dynamic';
import {Component, provide,OnInit} from '@angular/core';
import {HttpHelper} from './common/service/http-helper';
import {CommonService} from './common/service/common-service';
import {AuthService} from './common/service/auth-service';
import {Admin} from './admin';
import {LoginComponent} from './login/component/login-component';
import {appInjector} from './common/service/app-injector';
import {HTTP_PROVIDERS} from '@angular/http';

import { 
    ROUTER_DIRECTIVES, 
    ROUTER_PROVIDERS, 
    Routes,
    Router
} from '@angular/router';





import {
    APP_BASE_HREF,
    HashLocationStrategy,
    PathLocationStrategy,
    LocationStrategy,
    
} from '@angular/common'; 

import {enableProdMode} from '@angular/core';
//enableProdMode();



@Component({
    selector: 'app',
    directives: [ROUTER_DIRECTIVES],
    template: `
    <div style="padding-left:5px;padding-top:25px;">
    <router-outlet></router-outlet>
    </div>
    `
})


        

@Routes([
    { path: '/admin', component: Admin,},
    { path: '/', component: LoginComponent},
        
        
])


export class Main implements OnInit  {

    ngOnInit() {
        //alert('starting');
        //this.router.navigate(['/login']);
    }
    
    constructor( private router: Router) {
        
        
        
        
    }
    
   
    
}


bootstrap(Main, [
    HttpHelper,
    CommonService,
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    //provide(ROUTER_PRIMARY_COMPONENT, { useValue: Main }),
    provide(APP_BASE_HREF, { useValue: '/' }),
    provide(LocationStrategy, { useClass: HashLocationStrategy })
])
.then((appRef: any) => {
  // store a reference to the application injector
  appInjector(appRef.injector);
})
.catch((err: any) => console.error("*" + err));



