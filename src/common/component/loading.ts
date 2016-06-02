
import {Component, EventEmitter,Input} from '@angular/core'
import {Dialog} from 'primeng/primeng';


@Component({
    selector: 'loading',
    inputs: ['LoadingMessage','ShowLoading'],
    directives:[Dialog],
    styles: [`
    .ui-dialog-content {
      background: green;
    }
    `],
    template: `
    <p-dialog #load (onBeforeShow)="load.center()" styleClass="ui-dialog-content" header="{{LoadingMessage}}" modal="true" [center]="true" [resizable]="false" [height]="100" [contentHeight]="100" [width]="200" closeOnEscape="false" [closable]="false" [draggable]="false" [visible]="ShowLoading" [showEffect]="fade">
    <div class="text-center" style="font-size:16px;"><i class='fa fa-spinner fa-spin fa-3x'></i></div>
    </p-dialog>
    `
})
export class Loading {

    LoadingMessage:string;
    ShowLoading:boolean;
    
    constructor( ) {
        
    }
}


