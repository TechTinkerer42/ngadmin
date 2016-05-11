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
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var validation_service_1 = require('../service/validation-service');
var ControlMessages = (function () {
    function ControlMessages(_formDir) {
        this._formDir = _formDir;
    }
    Object.defineProperty(ControlMessages.prototype, "errorMessage", {
        get: function () {
            var c;
            var g;
            if (this.groupName != null) {
                g = this._formDir.form.find(this.groupName);
                c = this._formDir.form.find(this.groupName).find(this.controlName);
                for (var propertyName in g.errors) {
                    if (g.errors.hasOwnProperty(propertyName) && c.touched) {
                        return validation_service_1.ValidationService.getValidatorErrorMessage(propertyName);
                    }
                }
            }
            else {
                c = this._formDir.form.find(this.controlName);
            }
            for (var propertyName in c.errors) {
                if (c.errors.hasOwnProperty(propertyName) && c.touched) {
                    return validation_service_1.ValidationService.getValidatorErrorMessage(propertyName);
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    ControlMessages = __decorate([
        core_1.Component({
            selector: 'control-messages',
            inputs: ['controlName: control', 'groupName: groupName'],
            template: "<div *ngIf=\"errorMessage !== null\">{{errorMessage}}</div>"
        }),
        __param(0, core_1.Host()),
        __param(0, core_1.Inject(common_1.NgFormModel)), 
        __metadata('design:paramtypes', [common_1.NgFormModel])
    ], ControlMessages);
    return ControlMessages;
}());
exports.ControlMessages = ControlMessages;
//# sourceMappingURL=control-messages-component.js.map