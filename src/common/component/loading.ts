
import {Component, EventEmitter} from '@angular/core'

@Component({
    selector: 'loading',
    inputs: ['message','showLoading'],
    template: `
    <div class="text-center alert alert-success" style="padding:20px;font-size:18px;" *ngIf="showLoading"><i class='fa fa-spinner fa-spin'></i> {{message}}</div>
    `
})
export class Loading {

    message: string;
    showLoading: boolean;
    
    constructor( ) {
        
    }
}


