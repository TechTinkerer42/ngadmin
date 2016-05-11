import {Component, Inject, EventEmitter, Input} from '@angular/core'
import {ControlGroup, FormBuilder, Validators, AbstractControl, FORM_DIRECTIVES} from '@angular/common';
import {ControlMessages} from '../../common/component/control-messages-component';
import {MessagePanel} from '../../common/component/message-panel';
import {ValidationService} from '../../common/service/validation-service';
import {ComponentBase} from '../../common/component/component-base';
import {CustomerAccountService} from '../service/customer-account-service';
import {CustomerAccount} from '../service/customer-account-model';


@Component({
    selector: "edit-customer-account",
    outputs: ['onCancel', 'onDoneAdd'],
    directives: [ControlMessages, FORM_DIRECTIVES,  MessagePanel],
    template: `
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-7">
                <form [ngFormModel]="customerAccountForm" (ngSubmit)="addCustomerAccount(customerAccountForm.value)">

                <div *ngIf="alertMessage"><div class="alert alert-info" role="alert">{{alertMessage}}</div></div>

                <div class="form-group">
                    <div><label for="account" class="control-label">Account App:</label></div>

                    <div ngClass="{{errorClassToUse(customerAccountForm,'account')}}">
                        <select [ngFormControl]="account" class="form-control">
                            <option value=""></option>
                            <option value="19">Contractor IVR</option>
                            <option value="36">On Demand System</option>
                        </select>
                    </div>
                    <control-messages control="account"></control-messages>
                </div>

                <div class="form-group">
                    <div><label for="accountID">Account ID:</label></div>
                    <div ngClass="{{errorClassToUse(matchingAccountIDs,'accountID',true)}}">
                        <input class="form-control" [ngFormControl]="accountID" />
                    </div>
                    <control-messages control="accountID" groupName="matchingAccountIDs"></control-messages>
                </div>

                <div class="form-group">
                    <div><label for="confirmAccountID">Confirm Account ID:</label></div>
                    <div ngClass="{{errorClassToUse(matchingAccountIDs,'confirmAccountID',true)}}">
                        <input class="form-control" [ngFormControl]="confirmAccountID" />
                    </div>
                    <control-messages control="confirmAccountID" groupName="matchingAccountIDs"></control-messages>
                </div>

                <div class="form-group">
                    <div><label for="accountName">Account Name:</label></div>
                    <div ngClass="{{errorClassToUse(customerAccountForm,'accountName')}}">
                        <input class="form-control" [ngFormControl]="accountName"  />
                        <span *ngIf="checkingAccountName"><i class="fa fa-spinner fa-spin"></i> Checking...</span>
                    </div>
                    <control-messages control="accountName"></control-messages>
                </div>
        
                <input type="file" [ngFormControl]="audioFile" (change)="fileChangeEvent($event)" placeholder="Upload file..." /><br />
        
                <div class="form-group">
                    <a class="btn btn-default" *ngIf="!showDiscardOption" (click)="onCancelClicked();">Cancel</a>
                    <button class="btn btn-success" *ngIf="!showDiscardOption" [disabled]="!customerAccountForm.valid || !customerAccountForm.dirty || !fileWasUploaded || waiting || checkingAccountNam">Submit</button>
                    <div *ngIf="showDiscardOption">
                        <a class="btn btn-success" (click)="onCancel.emit('')">Discard Changes</a>
                        <a class="btn btn-default" (click)="showDiscardOption=false">Keep</a>
                    </div>
                    <div [hidden]="!waiting"><i class="fa fa-spinner fa-spin"></i> Please wait...</div>
                </div> 
            </form>
            </div>
        </div>
    </div>
    `
})

export class EditCustomerAccount extends ComponentBase {

    constructor(
        @Inject(FormBuilder) public fb: FormBuilder,
        @Inject(CustomerAccountService) public customerAccountService: CustomerAccountService) {
        super();
    }

    //model
    CustomerAccountModel: CustomerAccount;

    //properties
    @Input() set IncomingModel(model: CustomerAccount) {

        this.CustomerAccountModel = model;
        this.buildForm(); //reset form
    }

    //outputs
    onCancel: EventEmitter<any> = new EventEmitter();
    onDoneAdd: EventEmitter<any> = new EventEmitter();
    

    
    waiting: boolean = false;
    alertMessage: string;
    alertType: string;

    
    filesToUpload: Array<File> = [];
    fileWasUploaded: boolean = false;
    


    //controls
    customerAccountForm: ControlGroup;
    account: AbstractControl;
    accountName: AbstractControl;
    audioFile: AbstractControl;

    //groups stuff
    matchingAccountIDs: ControlGroup;
    accountID: AbstractControl;
    confirmAccountID: AbstractControl;

    //misc
    checkingAccountName: boolean = false;
    showDiscardOption: boolean = false;
    
    //events
    onCancelClicked() {
        if (this.customerAccountForm.dirty) {
            this.showDiscardOption = true;
        }
        else {
            this.onCancel.emit('')
        }
    }

    buildForm() {
        this.showDiscardOption = false;
        this.alertMessage = '';
        

        this.customerAccountForm = this.fb.group({
            'account': ['', ValidationService.RequiredSelectValidator],
            'accountName': ['', ValidationService.RequiredValidator],
            'audioFile': [''],
            matchingAccountIDs: this.fb.group({
                'accountID': ['', Validators.compose([ValidationService.RequiredValidator, ValidationService.NumberValidator])],
                'confirmAccountID': ['', Validators.compose([ValidationService.RequiredValidator, ValidationService.NumberValidator])],
            }, { validator: ValidationService.ConfirmAccountIDsMatch })
        });

        this.account = this.customerAccountForm.controls['account'];
        this.accountName = this.customerAccountForm.controls['accountName'];
        this.audioFile = this.customerAccountForm.controls['audioFile'];

        //group stuff
        this.matchingAccountIDs = <ControlGroup>this.customerAccountForm.controls['matchingAccountIDs'];
        this.accountID = this.matchingAccountIDs.controls['accountID'];
        this.confirmAccountID = this.matchingAccountIDs.controls['confirmAccountID'];
        
        this.accountName.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(aName => {

                if (aName.toString().trim().length > 0) {
                    this.checkingAccountName = true;
                    this.customerAccountService.AccountNumberValid(aName)
                        .subscribe(res => {
                            console.log(<any>res.json());
                            if (!<any>res.json()) {
                                this.accountName.setErrors({ invalidAccountName: true });
                            }
                            this.checkingAccountName = false;
                        });
                }

                this.accountName.markAsTouched();
            });
    }

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;

        this.fileWasUploaded = false;
        if (this.filesToUpload.length > 0) {
            this.fileWasUploaded = true;
            this.customerAccountForm.markAsDirty();
        }
    }

    addCustomerAccount() {
        
        var formData = this.customerAccountForm.value;

        var data = { files: this.filesToUpload, account: formData.account, accountID: formData.matchingAccountIDs.accountID, accountName: formData.accountName, filesToUpload: this.filesToUpload }

        this.waiting = true;

        this.customerAccountService.makeFileRequest(data)
            .then((result) => {
                this.alertMessage = 'Account and file successfully added';
                this.waiting = false;
                this.onDoneAdd.emit('');


            }, (error) => {
                this.waiting = false;
                console.log(error);
                this.alertMessage = 'System Error Occurred'
                this.alertType = "danger";


            });
    }

    

   
}





