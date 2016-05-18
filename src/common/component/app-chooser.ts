
import {Component, EventEmitter} from '@angular/core';

import {CommonService} from '../service/common-service';

@Component({
    selector: 'app-chooser',
    outputs: ['onAppChosen'],
    inputs: ['selectedApp'],
    template: `
    <select class="form-control" #appchoser (change)="onAppChosen.emit(appchoser.value)">
        <option *ngIf="!applications">Loading...</option>
        <option [selected]="app.intUniqueApplicationNum == selectedApp" value="{{app.intUniqueApplicationNum}}" *ngFor="let app of applications">{{app.strApplicationName}} ({{app.intUniqueApplicationNum}})</option>
    </select>
    `
})
export class ApplicationChooser  {

    onAppChosen: EventEmitter<string> = new EventEmitter<string>();

    applications: Array<any>;
    
    constructor(public commonService: CommonService) {
        
        this.commonService.getApplications()
            .subscribe(res => {
                this.applications = res;

            });
    }
    
  



}


