import {Component} from '@angular/core'

import { HeroesComponent } from './heroes/heroes.component';

import {ChrisTest} from './heroes/christest';




@Component({
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
    <toh-heroes></toh-heroes>
    <bob></bob>`,
    directives: [HeroesComponent,ChrisTest]
})
export class AppComponent {
  
  constructor()
  {
    console.log('hey!');
  }
  
  title = 'An Angular 2 Force Awakens!';
  
}
