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
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var angular2_jwt_1 = require('angular2-jwt');
var app_injector_1 = require('./app-injector');
var state_variables_1 = require('./state-variables');
var AuthService = (function () {
    function AuthService() {
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
    }
    AuthService.prototype.checkLogin = function (next, previous) {
        console.log('checking login!!');
        var isValid = true;
        //look for token
        var token = localStorage.getItem('id_token');
        if (token) {
            console.log('token found, now see if expired');
            var isExpired = this.jwtHelper.isTokenExpired(token);
            if (isExpired) {
                console.log('token is expired');
                isValid = false;
            }
            else {
                console.log('token NOT expired');
            }
        }
        else {
            //token not found
            console.log('token not found, going to login');
            isValid = false;
        }
        if (!isValid) {
            var injector = app_injector_1.appInjector(); // get the stored reference to the injector
            var router = injector.get(router_deprecated_1.Router);
            state_variables_1.StateVariables.referredRoute = next.routeName;
            router.navigate(['/Login']);
        }
        return isValid;
    };
    AuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map