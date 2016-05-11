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
var common_1 = require('@angular/common');
var control_messages_component_1 = require('../../common/component/control-messages-component');
var message_panel_1 = require('../../common/component/message-panel');
var validation_service_1 = require('../../common/service/validation-service');
var component_base_1 = require('../../common/component/component-base');
var customer_account_service_1 = require('../service/customer-account-service');
var customer_account_model_1 = require('../service/customer-account-model');
var EditCustomerAccount = (function (_super) {
    __extends(EditCustomerAccount, _super);
    function EditCustomerAccount(fb, customerAccountService) {
        _super.call(this);
        this.fb = fb;
        this.customerAccountService = customerAccountService;
        //outputs
        this.onCancel = new core_1.EventEmitter();
        this.onDoneAdd = new core_1.EventEmitter();
        this.waiting = false;
        this.filesToUpload = [];
        this.fileWasUploaded = false;
        //misc
        this.checkingAccountName = false;
        this.showDiscardOption = false;
    }
    Object.defineProperty(EditCustomerAccount.prototype, "IncomingModel", {
        //properties
        set: function (model) {
            this.CustomerAccountModel = model;
            this.buildForm(); //reset form
        },
        enumerable: true,
        configurable: true
    });
    //events
    EditCustomerAccount.prototype.onCancelClicked = function () {
        if (this.customerAccountForm.dirty) {
            this.showDiscardOption = true;
        }
        else {
            this.onCancel.emit('');
        }
    };
    EditCustomerAccount.prototype.buildForm = function () {
        var _this = this;
        this.showDiscardOption = false;
        this.alertMessage = '';
        this.customerAccountForm = this.fb.group({
            'account': ['', validation_service_1.ValidationService.RequiredSelectValidator],
            'accountName': ['', validation_service_1.ValidationService.RequiredValidator],
            'audioFile': [''],
            matchingAccountIDs: this.fb.group({
                'accountID': ['', common_1.Validators.compose([validation_service_1.ValidationService.RequiredValidator, validation_service_1.ValidationService.NumberValidator])],
                'confirmAccountID': ['', common_1.Validators.compose([validation_service_1.ValidationService.RequiredValidator, validation_service_1.ValidationService.NumberValidator])],
            }, { validator: validation_service_1.ValidationService.ConfirmAccountIDsMatch })
        });
        this.account = this.customerAccountForm.controls['account'];
        this.accountName = this.customerAccountForm.controls['accountName'];
        this.audioFile = this.customerAccountForm.controls['audioFile'];
        //group stuff
        this.matchingAccountIDs = this.customerAccountForm.controls['matchingAccountIDs'];
        this.accountID = this.matchingAccountIDs.controls['accountID'];
        this.confirmAccountID = this.matchingAccountIDs.controls['confirmAccountID'];
        this.accountName.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(function (aName) {
            if (aName.toString().trim().length > 0) {
                _this.checkingAccountName = true;
                _this.customerAccountService.AccountNumberValid(aName)
                    .subscribe(function (res) {
                    console.log(res.json());
                    if (!res.json()) {
                        _this.accountName.setErrors({ invalidAccountName: true });
                    }
                    _this.checkingAccountName = false;
                });
            }
            _this.accountName.markAsTouched();
        });
    };
    EditCustomerAccount.prototype.fileChangeEvent = function (fileInput) {
        this.filesToUpload = fileInput.target.files;
        this.fileWasUploaded = false;
        if (this.filesToUpload.length > 0) {
            this.fileWasUploaded = true;
            this.customerAccountForm.markAsDirty();
        }
    };
    EditCustomerAccount.prototype.addCustomerAccount = function () {
        var _this = this;
        var formData = this.customerAccountForm.value;
        var data = { files: this.filesToUpload, account: formData.account, accountID: formData.matchingAccountIDs.accountID, accountName: formData.accountName, filesToUpload: this.filesToUpload };
        this.waiting = true;
        this.customerAccountService.makeFileRequest(data)
            .then(function (result) {
            _this.alertMessage = 'Account and file successfully added';
            _this.waiting = false;
            _this.onDoneAdd.emit('');
        }, function (error) {
            _this.waiting = false;
            console.log(error);
            _this.alertMessage = 'System Error Occurred';
            _this.alertType = "danger";
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', customer_account_model_1.CustomerAccount), 
        __metadata('design:paramtypes', [customer_account_model_1.CustomerAccount])
    ], EditCustomerAccount.prototype, "IncomingModel", null);
    EditCustomerAccount = __decorate([
        core_1.Component({
            selector: "edit-customer-account",
            outputs: ['onCancel', 'onDoneAdd'],
            directives: [control_messages_component_1.ControlMessages, common_1.FORM_DIRECTIVES, message_panel_1.MessagePanel],
            template: "\n    <div class=\"container-fluid\">\n        <div class=\"row\">\n            <div class=\"col-md-7\">\n                <form [ngFormModel]=\"customerAccountForm\" (ngSubmit)=\"addCustomerAccount(customerAccountForm.value)\">\n\n                <div *ngIf=\"alertMessage\"><div class=\"alert alert-info\" role=\"alert\">{{alertMessage}}</div></div>\n\n                <div class=\"form-group\">\n                    <div><label for=\"account\" class=\"control-label\">Account App:</label></div>\n\n                    <div ngClass=\"{{errorClassToUse(customerAccountForm,'account')}}\">\n                        <select [ngFormControl]=\"account\" class=\"form-control\">\n                            <option value=\"\"></option>\n                            <option value=\"19\">Contractor IVR</option>\n                            <option value=\"36\">On Demand System</option>\n                        </select>\n                    </div>\n                    <control-messages control=\"account\"></control-messages>\n                </div>\n\n                <div class=\"form-group\">\n                    <div><label for=\"accountID\">Account ID:</label></div>\n                    <div ngClass=\"{{errorClassToUse(matchingAccountIDs,'accountID',true)}}\">\n                        <input class=\"form-control\" [ngFormControl]=\"accountID\" />\n                    </div>\n                    <control-messages control=\"accountID\" groupName=\"matchingAccountIDs\"></control-messages>\n                </div>\n\n                <div class=\"form-group\">\n                    <div><label for=\"confirmAccountID\">Confirm Account ID:</label></div>\n                    <div ngClass=\"{{errorClassToUse(matchingAccountIDs,'confirmAccountID',true)}}\">\n                        <input class=\"form-control\" [ngFormControl]=\"confirmAccountID\" />\n                    </div>\n                    <control-messages control=\"confirmAccountID\" groupName=\"matchingAccountIDs\"></control-messages>\n                </div>\n\n                <div class=\"form-group\">\n                    <div><label for=\"accountName\">Account Name:</label></div>\n                    <div ngClass=\"{{errorClassToUse(customerAccountForm,'accountName')}}\">\n                        <input class=\"form-control\" [ngFormControl]=\"accountName\"  />\n                        <span *ngIf=\"checkingAccountName\"><i class=\"fa fa-spinner fa-spin\"></i> Checking...</span>\n                    </div>\n                    <control-messages control=\"accountName\"></control-messages>\n                </div>\n        \n                <input type=\"file\" [ngFormControl]=\"audioFile\" (change)=\"fileChangeEvent($event)\" placeholder=\"Upload file...\" /><br />\n        \n                <div class=\"form-group\">\n                    <a class=\"btn btn-default\" *ngIf=\"!showDiscardOption\" (click)=\"onCancelClicked();\">Cancel</a>\n                    <button class=\"btn btn-success\" *ngIf=\"!showDiscardOption\" [disabled]=\"!customerAccountForm.valid || !customerAccountForm.dirty || !fileWasUploaded || waiting || checkingAccountNam\">Submit</button>\n                    <div *ngIf=\"showDiscardOption\">\n                        <a class=\"btn btn-success\" (click)=\"onCancel.emit('')\">Discard Changes</a>\n                        <a class=\"btn btn-default\" (click)=\"showDiscardOption=false\">Keep</a>\n                    </div>\n                    <div [hidden]=\"!waiting\"><i class=\"fa fa-spinner fa-spin\"></i> Please wait...</div>\n                </div> \n            </form>\n            </div>\n        </div>\n    </div>\n    "
        }),
        __param(0, core_1.Inject(common_1.FormBuilder)),
        __param(1, core_1.Inject(customer_account_service_1.CustomerAccountService)), 
        __metadata('design:paramtypes', [common_1.FormBuilder, customer_account_service_1.CustomerAccountService])
    ], EditCustomerAccount);
    return EditCustomerAccount;
}(component_base_1.ComponentBase));
exports.EditCustomerAccount = EditCustomerAccount;
//# sourceMappingURL=edit-customer-account.js.map