
import {Component, EventEmitter,Input} from '@angular/core'
import {Dialog} from 'primeng/primeng';


@Component({
    selector: 'loading',
    inputs: ['LoadingMessage','ShowLoading'],
    directives:[Dialog],
    template: `
    <p-dialog header="" modal="true" [center]="true" [resizable]="false" [height]="100" [contentHeight]="100" [width]="200" closeOnEscape="false" [closable]="false" [draggable]="false" [visible]="ShowLoading" [showEffect]="fade">
    <div class="text-center" style="font-size:16px;"><br><i class='fa fa-spinner fa-spin'></i> {{LoadingMessage}}</div>
    </p-dialog>
    `
})
export class Loading {

//<div class="text-center alert alert-success" style="padding:20px;font-size:18px;" *ngIf="ShowLoading">
  //  <i class='fa fa-spinner fa-spin'></i> {{LoadingMessage}}
    //</div>


    LoadingMessage:string;
    ShowLoading:boolean;
    
    constructor( ) {
        
    }
}


