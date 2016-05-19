

import {HttpHelper} from '../../common/service/http-helper';
import {Injectable} from '@angular/core';
import {MobilePrompt} from './mobile-prompt-model';


@Injectable()
export class MobilePromptService {
    
    constructor( private httpHelper: HttpHelper) {
    }

    
   
    
   
    
    
    getMobilePrompts(appNumber: Number) {
        
        return this.httpHelper.makeHttpCall('AngularAdmin/GetMobilePrompts', JSON.stringify({ appNumber: appNumber }), 'POST');
    }
    

    deleteMobilePrompt(promptID: number) {
        return this.httpHelper.makeHttpCall('AngularAdmin/DeleteMobilePrompt', JSON.stringify({ promptID: promptID }), 'POST');
    }

    getAudioKeysFromConfig(appNumber: Number) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetAudioKeysFromConfig', JSON.stringify({ appNumber: appNumber }), 'POST');
    }

    addMobilePrompt(data:MobilePrompt) {
        return this.httpHelper.makeHttpCall('AngularAdmin/AddMobilePrompt', JSON.stringify(data), 'POST');
    }

    editMobilePrompt(data:MobilePrompt) {
        return this.httpHelper.makeHttpCall('AngularAdmin/EditMobilePrompt', JSON.stringify(data), 'POST');
    }




    


}