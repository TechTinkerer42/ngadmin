"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var http_helper_1 = require('./common/service/http-helper');
var common_service_1 = require('./common/service/common-service');
var user_application_list_1 = require('./Users/component/user-application-list');
var customer_account_list_1 = require('./CustomerAccount/component/customer-account-list');
var mobile_prompt_list_1 = require('./MobilePrompts/component/mobile-prompt-list');
var file_importer_1 = require('./Importer/component/file-importer');
var geocoder_main_1 = require('./Geocoder/component/geocoder-main');
var login_component_1 = require('./login/component/login-component');
var app_injector_1 = require('./common/service/app-injector');
var http_1 = require('@angular/http');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
//enableProdMode();
var Main = (function () {
    function Main(router) {
        this.router = router;
    }
    Main = __decorate([
        core_1.Component({
            selector: 'app',
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            template: "\n    <div class=\"row\">\n        <div class=\"col-md-2\">\n            <ul id=\"sample-menu-3\" class=\"sf-menu sf-vertical\">\n                <li>\n                    <a [routerLink]=\"['CustomerAccountList']\">Customers</a>\n                </li>\n                <li>\n                    <a [routerLink]=\"['UserApplicationList']\">Users</a>\n                </li>\n                <li>\n                    <a [routerLink]=\"['MobilePromptList']\">Mobile Prompts</a>\n                </li>\n                <li>\n                    <a [routerLink]=\"['FileImporter']\">File Importer</a>\n                </li>\n                <li>\n                    <a [routerLink]=\"['Geocoder']\">Geo-coder</a>\n                </li>\n                \n             </ul>\n        </div>\n        <div class=\"col-md-9\">\n            <router-outlet></router-outlet>\n        </div>\n    </div>\n    "
        }),
        router_deprecated_1.RouteConfig([
            { path: '/customeraccountlist', name: 'CustomerAccountList', component: customer_account_list_1.CustomerAccountList },
            { path: '/userapplicationlist', name: 'UserApplicationList', component: user_application_list_1.UserApplicationList },
            { path: '/mobilepromptslist', name: 'MobilePromptList', component: mobile_prompt_list_1.MobilePromptList },
            { path: '/fileimport/', name: 'FileImporter', component: file_importer_1.FileImporter },
            { path: '/geocoder/', name: 'Geocoder', component: geocoder_main_1.Geocoder },
            { path: '/login/', name: 'Login', component: login_component_1.LoginComponent, useAsDefault: true },
        ]),
        __param(0, core_1.Inject(router_deprecated_1.Router)), 
        __metadata('design:paramtypes', [router_deprecated_1.Router])
    ], Main);
    return Main;
}());
exports.Main = Main;
platform_browser_dynamic_1.bootstrap(Main, [
    http_helper_1.HttpHelper,
    common_service_1.CommonService,
    //AuthService,
    http_1.HTTP_PROVIDERS,
    //AUTH_PROVIDERS,
    router_deprecated_1.ROUTER_PROVIDERS,
    core_1.provide(router_deprecated_1.ROUTER_PRIMARY_COMPONENT, { useValue: Main }),
    core_1.provide(common_1.APP_BASE_HREF, { useValue: '/' }),
    core_1.provide(common_1.LocationStrategy, { useClass: common_1.HashLocationStrategy })
])
    .then(function (appRef) {
    // store a reference to the application injector
    app_injector_1.appInjector(appRef.injector);
})
    .catch(function (err) { return console.error("*" + err); });
//# sourceMappingURL=main.js.map