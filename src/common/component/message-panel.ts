
import {Component, EventEmitter} from '@angular/core'



@Component({
    selector: 'message-panel',
    inputs: ['alertMessage','alertType'],
    template: `
    <div *ngIf="alertMessage">
    <div *ngIf="alertType === 'danger'" class="alert alert-danger" role="alert">{{alertMessage}}</div>
    <div *ngIf="alertType === 'info'" class="alert alert-info" role="alert">{{alertMessage}}</div>
    </div>
    `
})
export class MessagePanel {

    alertMessage: string;
    alertType: string;
    
    constructor( ) {
        
    }
}


