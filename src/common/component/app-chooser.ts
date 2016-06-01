
import {Component, EventEmitter} from '@angular/core';

import {CommonService} from '../service/common-service';

import {ComponentBase} from '../component/component-base';

@Component({
    selector: 'app-chooser',
    outputs: ['onAppChosen'],
    inputs: ['selectedApp'],
    template: `
    <select class="form-control appchooser" #appchoser (change)="onAppChosen.emit(appchoser.value)">
        <option *ngIf="!applications">Loading...</option>
        <option [selected]="app.intUniqueApplicationNum == selectedApp" value="{{app.intUniqueApplicationNum}}" *ngFor="let app of applications">{{app.strApplicationName}} ({{app.intUniqueApplicationNum}})</option>
    </select>
    `
})
export class ApplicationChooser extends ComponentBase  {

    onAppChosen: EventEmitter<any> = new EventEmitter<any>();
    selectedApp:number;
    applications: Array<any>;
    
    constructor(public commonService: CommonService) {
        super();
                
        this.commonService.getApplications()
            .subscribe(res => {
                this.applications = res;
                if(this.applications.length == 0)
                {
                    this.onAppChosen.emit(0);    
                }
                else{
                    let firstApp = this.applications[0].intUniqueApplicationNum;
                    
                    if(firstApp == 1)
                    {   firstApp = 15;
                        this.selectedApp = 15; //default to demo
                    }
                    
                    this.onAppChosen.emit(firstApp);
            }},
                 err => {
                this.showError(err, 'Error retrieving applications');
            }
                 
            );
    }
    
  



}


