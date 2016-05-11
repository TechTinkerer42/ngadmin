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
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var state_variables_1 = require('./state-variables');
var HttpHelper = (function () {
    function HttpHelper(http) {
        this.http = http;
    }
    HttpHelper.prototype.makeHttpCall = function (url, body, method, useAuth) {
        if (useAuth === void 0) { useAuth = true; }
        var appPath = location.pathname.split('/')[1];
        var header = new http_1.Headers({
            'Content-Type': 'application/json'
        });
        //if we are using auth, we replace the header
        if (useAuth) {
            var userToken = localStorage.getItem("id_token");
            //console.log(userToken);
            header = new http_1.Headers({
                'Authorization': userToken,
                'Content-Type': 'application/json'
            });
        }
        var options = new http_1.RequestOptions({
            method: method,
            url: "" + state_variables_1.StateVariables.API_ENDPOINT + url,
            headers: header,
            body: body
        });
        var req = new http_1.Request(options);
        return this.http.request(req);
    };
    HttpHelper = __decorate([
        __param(0, core_1.Inject(http_1.Http)), 
        __metadata('design:paramtypes', [http_1.Http])
    ], HttpHelper);
    return HttpHelper;
}());
exports.HttpHelper = HttpHelper;
//# sourceMappingURL=http-helper.js.map