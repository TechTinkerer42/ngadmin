"use strict";
var ValidationService = (function () {
    function ValidationService() {
    }
    ValidationService.getValidatorErrorMessage = function (code) {
        var config = {
            'required': 'Required',
            'selectrequired': 'Please select option',
            'invalidEmailAddress': 'Invalid email address',
            'invalidNumber': 'Invalid entry - must be a number',
            'async': 'async based validation failed',
            'invalidAccountName': 'Invalid Account Name!',
            'AccountIDsNotMatching': 'Account ID and Confirm must match'
        };
        return config[code];
    };
    ValidationService.RequiredSelectValidator = function (control) {
        if (control.value != '') {
            return null;
        }
        else {
            return { 'selectrequired': true };
        }
    };
    ValidationService.RequiredValidator = function (control) {
        if (control.value.trim().length > 0) {
            return null;
        }
        else {
            return { 'required': true };
        }
    };
    ValidationService.EmailValidator = function (control) {
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        }
        else {
            return { 'invalidEmailAddress': true };
        }
    };
    ValidationService.NumberValidator = function (control) {
        if (!isNaN(control.value)) {
            return null;
        }
        else {
            return { 'invalidNumber': true };
        }
    };
    ValidationService.ConfirmAccountIDsMatch = function (controlGroup) {
        var accountID = controlGroup.controls["accountID"];
        var confirmAccountID = controlGroup.controls["confirmAccountID"];
        if (accountID.value !== confirmAccountID.value) {
            return { 'AccountIDsNotMatching': true };
        }
        else {
            return null;
        }
    };
    return ValidationService;
}());
exports.ValidationService = ValidationService;
//# sourceMappingURL=validation-service.js.map