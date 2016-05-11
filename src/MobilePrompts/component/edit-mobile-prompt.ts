import {Component, Inject, EventEmitter, Input} from '@angular/core'
import {ControlGroup, FormBuilder, Validators, AbstractControl, FORM_DIRECTIVES} from '@angular/common';
import {ControlMessages} from '../../common/component/control-messages-component';
import {MessagePanel} from '../../common/component/message-panel';
import {ValidationService} from '../../common/service/validation-service';
import {ComponentBase} from '../../common/component/component-base';
import {MobilePromptService} from '../service/mobile-prompt-service';
import {ApplicationChooser} from '../../common/component/app-chooser'
import {LanguageChooser} from '../../common/component/language-chooser'
import {MobilePrompt} from '../service/mobile-prompt-model';  


@Component({
    selector: "edit-mobile-prompt",
    outputs: ['onCancel','onDoneAdd','onDoneEdit'],
    directives: [ControlMessages, FORM_DIRECTIVES, ApplicationChooser, LanguageChooser, MessagePanel],
    template: `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-7">
                <form [ngFormModel]="mobilePromptForm" (ngSubmit)="addEditMobilePrompt()">

                    <message-panel [alertMessage]="alertMessage" [alertType]="alertType"></message-panel>

                    <div class="form-group">
                        <div><label for="language" class="control-label">Language:</label></div>
                        <language-chooser [selectedLanguage]="PromptModel.language" (onLanguageChosen)="onLanguageChosen($event)"></language-chooser> 
                    </div>

                    <div class="form-group">
                        <div><label for="key">Audio Key:</label></div>
                        <div ngClass="{{errorClassToUse(mobilePromptForm,'key')}}">
                            <div class="input-group">
                                <input class="form-control" [ngFormControl]="key" [(ngModel)]="PromptModel.key" />
                                <span class="input-group-btn">
                                <a class="btn btn-default" (click)="showKeyPicker()">Choose</a>
                                </span>
                            </div>
                            <control-messages control="key"></control-messages>
                        </div> 
                    </div>

                    <div class="form-group">
                        <div><label for="translation">Translation:</label></div>
                        <div ngClass="{{errorClassToUse(mobilePromptForm,'translation')}}">
                                <textarea class="form-control" [ngFormControl]="translation" [(ngModel)]="PromptModel.translation"></textarea>
                            <control-messages control="translation"></control-messages>
                        </div> 
                    </div>

                    <div class="form-group">
                        <div><label for="promptBehaviorType" class="control-label">Behavior Type:</label></div>

                        <div ngClass="{{errorClassToUse(mobilePromptForm,'promptBehaviorType')}}">
                            <select [ngFormControl]="promptBehaviorType" class="form-control" [(ngModel)]="PromptModel.promptBehaviorType">
                                <option value="0">Regular</option>
                                <option value="1">Confirmation</option>
                            </select>
                        </div>
                        <control-messages control="promptBehaviorType"></control-messages>
                    </div>

                    <div class="form-group">
                        <div><label for="promptType" class="control-label">Prompt Type:</label></div>

                        <div ngClass="{{errorClassToUse(mobilePromptForm,'promptType')}}">
                            <select [ngFormControl]="promptType" class="form-control" [(ngModel)]="PromptModel.promptType" >
                                <option value="1">Regular</option>
                                <option value="2">Yes / No</option>
                            </select>
                        </div>
                        <control-messages control="promptType"></control-messages>
                    </div>
                    
                    <div class="form-group">
                        <div><label for="HasChild" class="control-label">Has Child:</label></div>
                        <input type="checkbox" class="form-control" [ngFormControl]="HasChild" [(ngModel)]="PromptModel.HasChild" />
                    </div>

                    <div class="form-group">
                        <div><label for="Parent" class="control-label">Parent:</label></div>

                        <div ngClass="{{errorClassToUse(mobilePromptForm,'Parent')}}">                        
                            <input type="text" class="form-control" [ngFormControl]="Parent" [(ngModel)]="PromptModel.Parent" />
                        </div>
                        <control-messages control="Parent"></control-messages>
                    </div>

                    <div class="form-group">
                        <div><label for="Value" class="control-label">Prompt Value:</label></div>

                        <div ngClass="{{errorClassToUse(mobilePromptForm,'Value')}}">
                            <input type="text" class="form-control" [ngFormControl]="Value" [(ngModel)]="PromptModel.Value" />
                        </div>
                        <control-messages control="Value"></control-messages>
                    </div>

                   
                    <div class="form-group">
                        <a class="btn btn-default" *ngIf="!showDiscardOption" (click)="onCancelClicked();">Cancel</a>
                        <button class="btn btn-success" *ngIf="!showDiscardOption" [disabled]="!mobilePromptForm.valid || !mobilePromptForm.dirty">Submit</button>
                        <div *ngIf="showDiscardOption">
                            <a class="btn btn-success" (click)="onCancel.emit('')">Discard Changes</a>
                            <a class="btn btn-default" (click)="showDiscardOption=false">Keep</a>
                        </div>
                        <div [hidden]="!waiting"><i class="fa fa-spinner fa-spin"></i> Please wait...</div>
                    </div>  
        
            </form>
            </div>
            <div *ngIf="keyPickerShowing" class="btn-group-vertical col-md-4 col-md-offset-1">
                <button type="button" class="btn btn-default" *ngFor="let but of AudioKeys" (click)="keyPickerShowing = false;PromptModel.key = but;">{{but}}</button>
            </div>
        </div>
    </div>
    `
})

export class EditMobilePrompt extends ComponentBase {

    constructor(
        @Inject(FormBuilder) public fb: FormBuilder,
        @Inject(MobilePromptService) public mobilePromptService: MobilePromptService) {
        super();
    }

    //model
    PromptModel: MobilePrompt;

    //properties
    @Input() set IncomingModel(model: MobilePrompt) {
        this.PromptModel = model;
        this.buildForm(); //reset form
    }
    
    //outputs
    onCancel: EventEmitter<any> = new EventEmitter();
    onDoneAdd: EventEmitter<any> = new EventEmitter();
    onDoneEdit: EventEmitter<any> = new EventEmitter();

    
    waiting: boolean = false;
    alertMessage: string;
    alertType: string;

    //controls
    mobilePromptForm: ControlGroup;
    key: AbstractControl;  
    translation: AbstractControl;
    language: AbstractControl;
    promptBehaviorType: AbstractControl;
    promptType: AbstractControl; 
    HasChild: AbstractControl;
    Parent: AbstractControl;
    Value: AbstractControl;

    //misc
    showDiscardOption: boolean = false;
    keyPickerShowing: boolean = false;
    AudioKeys: Array<string>;

    //events
    onCancelClicked() {
        if (this.mobilePromptForm.dirty) {
            this.showDiscardOption = true;
        }
        else {
            this.onCancel.emit('')
        }
    }
 
    onLanguageChosen(val:number) {
        this.PromptModel.language = val;
        this.mobilePromptForm.markAsDirty();    
    }
    
    showKeyPicker() {
        this.getAudioKeysFromConfig();
    }
   
    buildForm() {
        //console.log('built the form!!');
        this.showDiscardOption = false;
        this.alertMessage = '';
        this.keyPickerShowing = false;

        this.mobilePromptForm = this.fb.group({
            'key': ['', ValidationService.RequiredValidator],
            'translation': ['', ValidationService.RequiredValidator],
            'promptBehaviorType': ['', Validators.required],
            'promptType': ['', Validators.required],
            'HasChild': [''],
            'Parent': ['', ValidationService.NumberValidator],
            'Value': ['', ValidationService.NumberValidator],

        });
        
        this.key = this.mobilePromptForm.controls['key'];
        this.translation = this.mobilePromptForm.controls['translation'];
        this.promptBehaviorType = this.mobilePromptForm.controls['promptBehaviorType'];
        this.promptType = this.mobilePromptForm.controls['promptType'];
        this.HasChild = this.mobilePromptForm.controls['HasChild'];
        this.Parent = this.mobilePromptForm.controls['Parent'];
        this.Value = this.mobilePromptForm.controls['Value'];
    }
    
    addEditMobilePrompt() {

        this.waiting = true;

        if (this.PromptModel.promptID === -1) {
            this.mobilePromptService.addMobilePrompt(this.PromptModel)
                .subscribe(
                mp => {

                    this.waiting = false;
                    this.onDoneAdd.emit(mp.json());
                    
                },
                err => {
                    this.waiting = false;
                    console.log(err);
                    this.alertMessage = 'System error occurred';
                    this.alertType = "danger";
                }
                );
        }
        else {
            this.mobilePromptService.editMobilePrompt(this.PromptModel)
                .subscribe(
                mp => {
                    this.waiting = false;
                    this.onDoneEdit.emit(this.PromptModel);
                },
                err => {
                    this.waiting = false;
                    console.log(err);
                    this.alertMessage = 'System error occurred';
                    this.alertType = "danger";
                }
                );
        }
    }

    getAudioKeysFromConfig() {
        this.keyPickerShowing = false;
        this.mobilePromptService.getAudioKeysFromConfig(this.PromptModel.AppNum)
            .subscribe(
            ak => {

                this.AudioKeys = ak.json();
                this.keyPickerShowing = true;
            },
            err => {
                console.log(err);
                alert("Error retrieving mobile audio keys");
            }
            );
    }
}





