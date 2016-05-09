
import {Component, Inject, EventEmitter, ElementRef, OnInit} from '@angular/core'
import {Observable} from 'rxjs/Rx';


@Component({
    selector: 'searcher',
    outputs: ['onSearchTermEntered'],
    template: `
    <div class="form-group">
      <div class="input-group">
        <input class="form-control" name="term" #searchTerm style="width:auto"  />
        <span class="input-group-btn">
        <button class="btn btn-default" *ngIf="showClearButton" (click)="clearSearch(searchTerm);">Clear</button>
        </span>
      </div>
    </div>    
    `
})
export class SearchComponent implements OnInit {

    
    onSearchTermEntered: EventEmitter<string> = new EventEmitter<string>();

    showClearButton: boolean = false;

    constructor( @Inject(ElementRef) private el: ElementRef) {
        
    }

    clearSearch(searchTerm:any) {
        searchTerm.value = '';
        this.onSearchTermEntered.emit('')
        this.showClearButton = false;
    }
    

    ngOnInit() {
 
        Observable.fromEvent(this.el.nativeElement,"keyup")
            .debounceTime(250)
            .map((e: any) => e.target.value)
            .subscribe((text: string) => {
                this.showClearButton = text.length > 0;
                this.onSearchTermEntered.emit(text)
            });

       

    }





}


