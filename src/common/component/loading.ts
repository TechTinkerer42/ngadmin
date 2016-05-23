
import {Component, EventEmitter,Input} from '@angular/core'

@Component({
    selector: 'loading',
    inputs: ['LoadingMessage','ShowLoading'],
    template: `
    <div class="text-center alert alert-success" style="padding:20px;font-size:18px;" *ngIf="ShowLoading"><i class='fa fa-spinner fa-spin'></i> {{LoadingMessage}}</div>
    `
})
export class Loading {

    LoadingMessage:string;
    ShowLoading:boolean;
    
    constructor( ) {
        
    }
}


