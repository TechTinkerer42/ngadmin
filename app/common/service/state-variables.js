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
var StateVariables = (function () {
    function StateVariables() {
    }
    Object.defineProperty(StateVariables, "API_ENDPOINT", {
        get: function () {
            var result = 'http://www.servicepartnerplatform.com/spptest/';
            switch (window.location.hostname) {
                case "localhost":
                    result = 'http://localhost:8011/sppdev/';
                    break;
            }
            console.log(result);
            return result;
        },
        enumerable: true,
        configurable: true
    });
    StateVariables.referredRoute = "";
    StateVariables = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], StateVariables);
    return StateVariables;
}());
exports.StateVariables = StateVariables;
//# sourceMappingURL=state-variables.js.map