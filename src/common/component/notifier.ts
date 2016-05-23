
import {Component, EventEmitter,Input} from '@angular/core'

@Component({
    selector: 'notifier',
    inputs: ['ErrorMessage','LoadingMessage','InfoMessage'],
    template: `
    <div *ngIf="ErrorMessage" style="font-size:18px;"class="text-center alert alert-danger alert-dismissible fade in" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    {{ErrorMessage}}
    <br>
    </div>
    <div class="text-center alert alert-success" style="padding:20px;font-size:18px;" *ngIf="LoadingMessage"><i class='fa fa-spinner fa-spin'></i> {{LoadingMessage}}</div>
    <div *ngIf="InfoMessage" style="font-size:18px;"class="text-center alert alert-info alert-dismissible fade in" role="alert">
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </button>
    {{InfoMessage}}
    <br>
    </div>
    `
})
export class Notifier {

    ErrorMessage:string;
    LoadingMessage:string = "";
    InfoMessage:string = "";
    
    
    constructor( ) {
        
    }
}


