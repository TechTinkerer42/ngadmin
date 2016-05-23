

import {HttpHelper} from '../../common/service/http-helper';
import {Injectable} from '@angular/core';
import {Ticket} from './ticket-model';


@Injectable()
export class TicketService {
    
    constructor( private httpHelper: HttpHelper) {
    }
    
    getTickets(appNumber: Number, accountNumber:string,fromDate:string,fromTime:string,toDate:string,toTime:string) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetTickets', JSON.stringify({ appNumber: appNumber, accountNumber:accountNumber, fromDate:fromDate,fromTime:fromTime,toDate:toDate,toTime:toTime }), 'POST');
    }
    
    getGridColumnsByAppID(appID: number,accountNumber:string) {
        return this.httpHelper.makeHttpCall('AngularAdmin/GetGridColumnsByAppID', JSON.stringify({ appID: appID,accountNumber:accountNumber }), 'POST');
    }
    
    /*deleteMobilePrompt(promptID: number) {
        return this.httpHelper.makeHttpCall('AngularAdmin/DeleteMobilePrompt', JSON.stringify({ promptID: promptID }), 'POST');
    }

    addMobilePrompt(data:Ticket) {
        return this.httpHelper.makeHttpCall('AngularAdmin/AddMobilePrompt', JSON.stringify(data), 'POST');
    }

    editMobilePrompt(data:Ticket) {
        return this.httpHelper.makeHttpCall('AngularAdmin/EditMobilePrompt', JSON.stringify(data), 'POST');
    }*/




    


}