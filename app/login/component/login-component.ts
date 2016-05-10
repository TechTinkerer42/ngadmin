
import {Component,Inject,OnInit,Injector} from '@angular/core'
import {Router,RouteParams} from '@angular/router-deprecated'
import {ControlGroup, FormBuilder, Validators, AbstractControl, FORM_DIRECTIVES} from '@angular/common';
import {ControlMessages} from '../../common/component/control-messages-component';
import {MessagePanel} from '../../common/component/message-panel';
import {ValidationService} from '../../common/service/validation-service';
import {ComponentBase} from '../../common/component/component-base';
import {LoginService} from '../service/login-service';
import {appInjector} from '../../common/service/app-injector';
import {StateVariables} from '../../common/service/state-variables-service';

@Component({
    directives: [ControlMessages, FORM_DIRECTIVES,  MessagePanel],
    providers: [LoginService],
    template: `
        <div class="container-fluid">
        <div class="row" class="col-md-3">
            <form [ngFormModel]="loginForm" (ngSubmit)="loginUser()">

            <div *ngIf="alertMessage"><div class="alert alert-info" role="alert">{{alertMessage}}</div></div>

            <div class="form-group">
                <div><label for="userName">Username:</label></div>
                <div ngClass="{{errorClassToUse(loginForm,'userName')}}">
                    <input class="form-control" [ngFormControl]="userName"  />
                </div>
                <control-messages control="userName"></control-messages>
            </div>
            
                <div class="form-group">
                <div><label for="password">Password:</label></div>
                <div ngClass="{{errorClassToUse(loginForm,'password')}}">
                    <input type="password" class="form-control" [ngFormControl]="password"  />
                </div>
                <control-messages control="password"></control-messages>
            </div>

            <div class="form-group">
                <button class="btn btn-success" [disabled]="!loginForm.valid || !loginForm.dirty">Submit</button>
                <div [hidden]="!waiting"><i class="fa fa-spinner fa-spin"></i> Please wait...</div>
            </div> 
            </form>
        </div>
        </div>`
        
})

export class LoginComponent extends ComponentBase implements OnInit {
    constructor(
    @Inject(FormBuilder) public fb: FormBuilder,
    @Inject(LoginService) public loginService: LoginService,
    @Inject(RouteParams) public routeParams: RouteParams
    ) 
    { 
        super();
    }

    waiting: boolean = false; 
    alertMessage: string;
    alertType: string;


    //controls
    loginForm: ControlGroup;
    userName: AbstractControl;
    password: AbstractControl;
    ngOnInit() { 
        this.buildForm();
    }
    
    buildForm() {
        
        this.alertMessage = '';
        

        this.loginForm = this.fb.group({
            'userName': ['', ValidationService.RequiredValidator],
            'password': ['', ValidationService.RequiredValidator],
        });

        this.userName = this.loginForm.controls['userName'];
        this.password = this.loginForm.controls['password'];
        
        
    }
    
    loginUser() {
         this.alertMessage = '';
                    
        var formData = this.loginForm.value;

        var data = { UserName: formData.userName, Password: formData.password }

        this.waiting = true;

        this.loginService.loginUser(data)
            .subscribe(
            mp => {
                //console.log(mp.token);
                localStorage.setItem('id_token',mp.token);
                this.waiting = false;
                //go to where we were before
                
                let injector: Injector = appInjector(); // get the stored reference to the injector
	            let router: Router = injector.get(Router);
        
                if(StateVariables.referredRoute)
                {
                    router.navigate([StateVariables.referredRoute]);        
                }
                
            },
            err => {
                this.waiting = false;
                console.log(err);
                this.alertMessage = 'Invalid User/Password';
                this.alertType = "danger";
            }
            );
    }


}