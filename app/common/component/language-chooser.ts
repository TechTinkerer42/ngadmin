
import {Component, EventEmitter} from '@angular/core'

@Component({
    selector: 'language-chooser',
    outputs: ['onLanguageChosen'],
    inputs: ['selectedLanguage'],
    template: `
    <select class="form-control" #langChooser (change)="onLanguageChosen.emit(langChooser.value)">
        <option [selected]="selectedLanguage == 1" value="1">English</option>
        <option [selected]="selectedLanguage == 2" value="2">Spanish</option>
    </select>
    `
})
export class LanguageChooser {

    onLanguageChosen: EventEmitter<string> = new EventEmitter<string>();
    
    constructor() {       
    }



}


