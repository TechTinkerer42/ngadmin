﻿

import {HttpHelper} from '../../common/service/http-helper';
import {Inject, Injectable} from '@angular/core';
import {MobilePrompt} from './mobile-prompt-model';


@Injectable()
export class MobilePromptService {
    
    constructor( @Inject(HttpHelper) public httpHelper: HttpHelper) {
    }

    
    getMobilePrompts(appNumber: Number) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetMobilePrompts', JSON.stringify({ appNumber: appNumber }), 'POST', false);
    }
    

    deleteMobilePrompt(promptID: number) {
        return this.httpHelper.makeHttpCall('AngularAdmin/DeleteMobilePrompt', JSON.stringify({ promptID: promptID }), 'POST', false);
    }

    getAudioKeysFromConfig(appNumber: Number) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetAudioKeysFromConfig', JSON.stringify({ appNumber: appNumber }), 'POST', false);
    }

    addMobilePrompt(data:MobilePrompt) {
        return this.httpHelper.makeHttpCall('AngularAdmin/AddMobilePrompt', JSON.stringify(data), 'POST', false);
    }

    editMobilePrompt(data:MobilePrompt) {
        return this.httpHelper.makeHttpCall('AngularAdmin/EditMobilePrompt', JSON.stringify(data), 'POST', false);
    }




    


}