"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var common_1 = require('@angular/common');
var control_messages_component_1 = require('../../common/component/control-messages-component');
var message_panel_1 = require('../../common/component/message-panel');
var validation_service_1 = require('../../common/service/validation-service');
var component_base_1 = require('../../common/component/component-base');
var login_service_1 = require('../service/login-service');
var app_injector_1 = require('../../common/service/app-injector');
var state_variables_1 = require('../../common/service/state-variables');
var LoginComponent = (function (_super) {
    __extends(LoginComponent, _super);
    function LoginComponent(fb, loginService, routeParams) {
        _super.call(this);
        this.fb = fb;
        this.loginService = loginService;
        this.routeParams = routeParams;
        this.waiting = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    LoginComponent.prototype.buildForm = function () {
        this.alertMessage = '';
        this.loginForm = this.fb.group({
            'userName': ['', validation_service_1.ValidationService.RequiredValidator],
            'password': ['', validation_service_1.ValidationService.RequiredValidator],
        });
        this.userName = this.loginForm.controls['userName'];
        this.password = this.loginForm.controls['password'];
    };
    LoginComponent.prototype.loginUser = function () {
        var _this = this;
        this.alertMessage = '';
        var formData = this.loginForm.value;
        var data = { UserName: formData.userName, Password: formData.password };
        this.waiting = true;
        this.loginService.loginUser(data)
            .subscribe(function (mp) {
            //console.log(mp.token);
            localStorage.setItem('id_token', mp.token);
            _this.waiting = false;
            //go to where we were before
            var injector = app_injector_1.appInjector(); // get the stored reference to the injector
            var router = injector.get(router_deprecated_1.Router);
            if (state_variables_1.StateVariables.referredRoute) {
                router.navigate([state_variables_1.StateVariables.referredRoute]);
            }
            else {
                _this.alertType = "info";
                _this.alertMessage = "Successfully logged in";
            }
        }, function (err) {
            _this.waiting = false;
            console.log(err);
            _this.alertMessage = 'Invalid User/Password';
            _this.alertType = "danger";
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            directives: [control_messages_component_1.ControlMessages, common_1.FORM_DIRECTIVES, message_panel_1.MessagePanel],
            providers: [login_service_1.LoginService],
            template: "\n        <div class=\"container-fluid\">\n        <div class=\"row\" class=\"col-md-3\">\n            <form [ngFormModel]=\"loginForm\" (ngSubmit)=\"loginUser()\">\n\n            <div *ngIf=\"alertMessage\"><div class=\"alert alert-info\" role=\"alert\">{{alertMessage}}</div></div>\n\n            <div class=\"form-group\">\n                <div><label for=\"userName\">Username:</label></div>\n                <div ngClass=\"{{errorClassToUse(loginForm,'userName')}}\">\n                    <input class=\"form-control\" [ngFormControl]=\"userName\"  />\n                </div>\n                <control-messages control=\"userName\"></control-messages>\n            </div>\n            \n                <div class=\"form-group\">\n                <div><label for=\"password\">Password:</label></div>\n                <div ngClass=\"{{errorClassToUse(loginForm,'password')}}\">\n                    <input type=\"password\" class=\"form-control\" [ngFormControl]=\"password\"  />\n                </div>\n                <control-messages control=\"password\"></control-messages>\n            </div>\n\n            <div class=\"form-group\">\n                <button class=\"btn btn-success\" [disabled]=\"!loginForm.valid || !loginForm.dirty\">Submit</button>\n                <div [hidden]=\"!waiting\"><i class=\"fa fa-spinner fa-spin\"></i> Please wait...</div>\n            </div> \n            </form>\n        </div>\n        </div>"
        }),
        __param(0, core_1.Inject(common_1.FormBuilder)),
        __param(1, core_1.Inject(login_service_1.LoginService)),
        __param(2, core_1.Inject(router_deprecated_1.RouteParams)), 
        __metadata('design:paramtypes', [common_1.FormBuilder, login_service_1.LoginService, router_deprecated_1.RouteParams])
    ], LoginComponent);
    return LoginComponent;
}(component_base_1.ComponentBase));
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login-component.js.map