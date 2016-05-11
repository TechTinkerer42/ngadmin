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
var mobile_prompt_service_1 = require('../service/mobile-prompt-service');
var app_chooser_1 = require('../../common/component/app-chooser');
var language_chooser_1 = require('../../common/component/language-chooser');
var mobile_prompt_model_1 = require('../service/mobile-prompt-model');
var EditMobilePrompt = (function (_super) {
    __extends(EditMobilePrompt, _super);
    function EditMobilePrompt(fb, mobilePromptService) {
        _super.call(this);
        this.fb = fb;
        this.mobilePromptService = mobilePromptService;
        //outputs
        this.onCancel = new core_1.EventEmitter();
        this.onDoneAdd = new core_1.EventEmitter();
        this.onDoneEdit = new core_1.EventEmitter();
        this.waiting = false;
        //misc
        this.showDiscardOption = false;
        this.keyPickerShowing = false;
    }
    Object.defineProperty(EditMobilePrompt.prototype, "IncomingModel", {
        //properties
        set: function (model) {
            this.PromptModel = model;
            this.buildForm(); //reset form
        },
        enumerable: true,
        configurable: true
    });
    //events
    EditMobilePrompt.prototype.onCancelClicked = function () {
        if (this.mobilePromptForm.dirty) {
            this.showDiscardOption = true;
        }
        else {
            this.onCancel.emit('');
        }
    };
    EditMobilePrompt.prototype.onLanguageChosen = function (val) {
        this.PromptModel.language = val;
        this.mobilePromptForm.markAsDirty();
    };
    EditMobilePrompt.prototype.showKeyPicker = function () {
        this.getAudioKeysFromConfig();
    };
    EditMobilePrompt.prototype.buildForm = function () {
        //console.log('built the form!!');
        this.showDiscardOption = false;
        this.alertMessage = '';
        this.keyPickerShowing = false;
        this.mobilePromptForm = this.fb.group({
            'key': ['', validation_service_1.ValidationService.RequiredValidator],
            'translation': ['', validation_service_1.ValidationService.RequiredValidator],
            'promptBehaviorType': ['', common_1.Validators.required],
            'promptType': ['', common_1.Validators.required],
            'HasChild': [''],
            'Parent': ['', validation_service_1.ValidationService.NumberValidator],
            'Value': ['', validation_service_1.ValidationService.NumberValidator],
        });
        this.key = this.mobilePromptForm.controls['key'];
        this.translation = this.mobilePromptForm.controls['translation'];
        this.promptBehaviorType = this.mobilePromptForm.controls['promptBehaviorType'];
        this.promptType = this.mobilePromptForm.controls['promptType'];
        this.HasChild = this.mobilePromptForm.controls['HasChild'];
        this.Parent = this.mobilePromptForm.controls['Parent'];
        this.Value = this.mobilePromptForm.controls['Value'];
    };
    EditMobilePrompt.prototype.addEditMobilePrompt = function () {
        var _this = this;
        this.waiting = true;
        if (this.PromptModel.promptID === -1) {
            this.mobilePromptService.addMobilePrompt(this.PromptModel)
                .subscribe(function (mp) {
                _this.waiting = false;
                _this.onDoneAdd.emit(mp.json());
            }, function (err) {
                _this.waiting = false;
                console.log(err);
                _this.alertMessage = 'System error occurred';
                _this.alertType = "danger";
            });
        }
        else {
            this.mobilePromptService.editMobilePrompt(this.PromptModel)
                .subscribe(function (mp) {
                _this.waiting = false;
                _this.onDoneEdit.emit(_this.PromptModel);
            }, function (err) {
                _this.waiting = false;
                console.log(err);
                _this.alertMessage = 'System error occurred';
                _this.alertType = "danger";
            });
        }
    };
    EditMobilePrompt.prototype.getAudioKeysFromConfig = function () {
        var _this = this;
        this.keyPickerShowing = false;
        this.mobilePromptService.getAudioKeysFromConfig(this.PromptModel.AppNum)
            .subscribe(function (ak) {
            _this.AudioKeys = ak.json();
            _this.keyPickerShowing = true;
        }, function (err) {
            console.log(err);
            alert("Error retrieving mobile audio keys");
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', mobile_prompt_model_1.MobilePrompt), 
        __metadata('design:paramtypes', [mobile_prompt_model_1.MobilePrompt])
    ], EditMobilePrompt.prototype, "IncomingModel", null);
    EditMobilePrompt = __decorate([
        core_1.Component({
            selector: "edit-mobile-prompt",
            outputs: ['onCancel', 'onDoneAdd', 'onDoneEdit'],
            directives: [control_messages_component_1.ControlMessages, common_1.FORM_DIRECTIVES, app_chooser_1.ApplicationChooser, language_chooser_1.LanguageChooser, message_panel_1.MessagePanel],
            template: "\n    <div class=\"container-fluid\">\n        <div class=\"row\">\n            <div class=\"col-md-7\">\n                <form [ngFormModel]=\"mobilePromptForm\" (ngSubmit)=\"addEditMobilePrompt()\">\n\n                    <message-panel [alertMessage]=\"alertMessage\" [alertType]=\"alertType\"></message-panel>\n\n                    <div class=\"form-group\">\n                        <div><label for=\"language\" class=\"control-label\">Language:</label></div>\n                        <language-chooser [selectedLanguage]=\"PromptModel.language\" (onLanguageChosen)=\"onLanguageChosen($event)\"></language-chooser> \n                    </div>\n\n                    <div class=\"form-group\">\n                        <div><label for=\"key\">Audio Key:</label></div>\n                        <div ngClass=\"{{errorClassToUse(mobilePromptForm,'key')}}\">\n                            <div class=\"input-group\">\n                                <input class=\"form-control\" [ngFormControl]=\"key\" [(ngModel)]=\"PromptModel.key\" />\n                                <span class=\"input-group-btn\">\n                                <a class=\"btn btn-default\" (click)=\"showKeyPicker()\">Choose</a>\n                                </span>\n                            </div>\n                            <control-messages control=\"key\"></control-messages>\n                        </div> \n                    </div>\n\n                    <div class=\"form-group\">\n                        <div><label for=\"translation\">Translation:</label></div>\n                        <div ngClass=\"{{errorClassToUse(mobilePromptForm,'translation')}}\">\n                                <textarea class=\"form-control\" [ngFormControl]=\"translation\" [(ngModel)]=\"PromptModel.translation\"></textarea>\n                            <control-messages control=\"translation\"></control-messages>\n                        </div> \n                    </div>\n\n                    <div class=\"form-group\">\n                        <div><label for=\"promptBehaviorType\" class=\"control-label\">Behavior Type:</label></div>\n\n                        <div ngClass=\"{{errorClassToUse(mobilePromptForm,'promptBehaviorType')}}\">\n                            <select [ngFormControl]=\"promptBehaviorType\" class=\"form-control\" [(ngModel)]=\"PromptModel.promptBehaviorType\">\n                                <option value=\"0\">Regular</option>\n                                <option value=\"1\">Confirmation</option>\n                            </select>\n                        </div>\n                        <control-messages control=\"promptBehaviorType\"></control-messages>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <div><label for=\"promptType\" class=\"control-label\">Prompt Type:</label></div>\n\n                        <div ngClass=\"{{errorClassToUse(mobilePromptForm,'promptType')}}\">\n                            <select [ngFormControl]=\"promptType\" class=\"form-control\" [(ngModel)]=\"PromptModel.promptType\" >\n                                <option value=\"1\">Regular</option>\n                                <option value=\"2\">Yes / No</option>\n                            </select>\n                        </div>\n                        <control-messages control=\"promptType\"></control-messages>\n                    </div>\n                    \n                    <div class=\"form-group\">\n                        <div><label for=\"HasChild\" class=\"control-label\">Has Child:</label></div>\n                        <input type=\"checkbox\" class=\"form-control\" [ngFormControl]=\"HasChild\" [(ngModel)]=\"PromptModel.HasChild\" />\n                    </div>\n\n                    <div class=\"form-group\">\n                        <div><label for=\"Parent\" class=\"control-label\">Parent:</label></div>\n\n                        <div ngClass=\"{{errorClassToUse(mobilePromptForm,'Parent')}}\">                        \n                            <input type=\"text\" class=\"form-control\" [ngFormControl]=\"Parent\" [(ngModel)]=\"PromptModel.Parent\" />\n                        </div>\n                        <control-messages control=\"Parent\"></control-messages>\n                    </div>\n\n                    <div class=\"form-group\">\n                        <div><label for=\"Value\" class=\"control-label\">Prompt Value:</label></div>\n\n                        <div ngClass=\"{{errorClassToUse(mobilePromptForm,'Value')}}\">\n                            <input type=\"text\" class=\"form-control\" [ngFormControl]=\"Value\" [(ngModel)]=\"PromptModel.Value\" />\n                        </div>\n                        <control-messages control=\"Value\"></control-messages>\n                    </div>\n\n                   \n                    <div class=\"form-group\">\n                        <a class=\"btn btn-default\" *ngIf=\"!showDiscardOption\" (click)=\"onCancelClicked();\">Cancel</a>\n                        <button class=\"btn btn-success\" *ngIf=\"!showDiscardOption\" [disabled]=\"!mobilePromptForm.valid || !mobilePromptForm.dirty\">Submit</button>\n                        <div *ngIf=\"showDiscardOption\">\n                            <a class=\"btn btn-success\" (click)=\"onCancel.emit('')\">Discard Changes</a>\n                            <a class=\"btn btn-default\" (click)=\"showDiscardOption=false\">Keep</a>\n                        </div>\n                        <div [hidden]=\"!waiting\"><i class=\"fa fa-spinner fa-spin\"></i> Please wait...</div>\n                    </div>  \n        \n            </form>\n            </div>\n            <div *ngIf=\"keyPickerShowing\" class=\"btn-group-vertical col-md-4 col-md-offset-1\">\n                <button type=\"button\" class=\"btn btn-default\" *ngFor=\"let but of AudioKeys\" (click)=\"keyPickerShowing = false;PromptModel.key = but;\">{{but}}</button>\n            </div>\n        </div>\n    </div>\n    "
        }),
        __param(0, core_1.Inject(common_1.FormBuilder)),
        __param(1, core_1.Inject(mobile_prompt_service_1.MobilePromptService)), 
        __metadata('design:paramtypes', [common_1.FormBuilder, mobile_prompt_service_1.MobilePromptService])
    ], EditMobilePrompt);
    return EditMobilePrompt;
}(component_base_1.ComponentBase));
exports.EditMobilePrompt = EditMobilePrompt;
//# sourceMappingURL=edit-mobile-prompt.js.map