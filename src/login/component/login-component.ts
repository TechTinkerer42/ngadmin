
import {Component,OnInit} from '@angular/core'
import {ControlGroup, FormBuilder, Validators, AbstractControl, FORM_DIRECTIVES} from '@angular/common';
import {ControlMessages} from '../../common/component/control-messages-component';
import {MessagePanel} from '../../common/component/message-panel';
import {ValidationService} from '../../common/service/validation-service';
import {ComponentBase} from '../../common/component/component-base';
import {LoginService} from '../service/login-service';
import {AuthService} from '../../common/service/auth-service';
import {JwtHelper} from 'angular2-jwt';
import {appInjector} from '../../common/service/app-injector';

@Component({
    directives: [ControlMessages, FORM_DIRECTIVES,  MessagePanel],
    providers: [LoginService,AuthService],
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
                <input type="checkbox" [ngFormControl]="rememberMe"  />&nbsp;<label for="rememberMe">Remember Me:</label>
            </div>
            
            <div class="form-group">
                <button class="btn btn-success" [disabled]="!loginForm.valid || !loginForm.dirty">Submit</button>
                <br><br>
                <div [hidden]="!waiting"><i class="fa fa-spinner fa-spin"></i> Please wait...</div>
            </div> 
            </form>
        </div>
        </div>`
        
})

//we do this canactivate here just to see if we are logged in or not

export class LoginComponent extends ComponentBase implements OnInit {
    constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService) 
    { 
        super();
    }

    waiting: boolean = false; 
    alertMessage: string;
    alertType: string;
    jwtHelper: JwtHelper = new JwtHelper();
    //controls
    loginForm: ControlGroup;
    userName: AbstractControl;
    password: AbstractControl;
    rememberMe: AbstractControl;
    
    ngOnInit() { 
        this.buildForm();
        if(this.authService.isTokenValid())
        {
            this.authService.navigateTo('/Admin/AdminHome');
            
            //this.alertType = "info";
            //this.alertMessage = "Successfully logged in";
        }
        
        
    }
    
    buildForm() {
        
        let storedUserName = localStorage.getItem('u_name');
        let rem_me = localStorage.getItem('rem_me');
        
        let rememberMeChecked = false;
        if(rem_me == null)
        {
            storedUserName = "";
        }
        else{
            storedUserName = storedUserName;
            rememberMeChecked = true;
        }
        this.alertMessage = '';

        this.loginForm = this.fb.group({
            'userName': [storedUserName, ValidationService.RequiredValidator],
            'password': ['', ValidationService.RequiredValidator],
            'rememberMe': [rememberMeChecked],
        });

        this.userName = this.loginForm.controls['userName'];
        this.password = this.loginForm.controls['password'];
        this.rememberMe = this.loginForm.controls['rememberMe'];
        
        
    }
    
    loginUser() {
        
        this.alertMessage = '';
                    
        var formData = this.loginForm.value;

        var data = { UserName: formData.userName, Password: formData.password }

        this.waiting = true;

        this.loginService.loginUser(data)
            .subscribe(
            mp => {
                
                if(this.rememberMe.value)
                {
                   localStorage.setItem('u_name',formData.userName);
                   localStorage.setItem('rem_me',"yes");    
                }
                else{
                    localStorage.removeItem('rem_me');
                }
                
                
                localStorage.setItem('id_token',mp.token);
                
                this.waiting = false;
                
                this.authService.navigateTo('/Admin');
                 //this.alertType = "info";
                 //this.alertMessage = "Successfully logged in";
                
                
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