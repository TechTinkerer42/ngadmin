"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var Rx_1 = require('rxjs/Rx');
var SearchComponent = (function () {
    function SearchComponent(el) {
        this.el = el;
        this.onSearchTermEntered = new core_1.EventEmitter();
        this.showClearButton = false;
    }
    SearchComponent.prototype.clearSearch = function (searchTerm) {
        searchTerm.value = '';
        this.onSearchTermEntered.emit('');
        this.showClearButton = false;
    };
    SearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        Rx_1.Observable.fromEvent(this.el.nativeElement, "keyup")
            .debounceTime(250)
            .map(function (e) { return e.target.value; })
            .subscribe(function (text) {
            _this.showClearButton = text.length > 0;
            _this.onSearchTermEntered.emit(text);
        });
    };
    SearchComponent = __decorate([
        core_1.Component({
            selector: 'searcher',
            outputs: ['onSearchTermEntered'],
            template: "\n    <div class=\"form-group\">\n      <div class=\"input-group\">\n        <input class=\"form-control\" name=\"term\" #searchTerm style=\"width:auto\"  />\n        <span class=\"input-group-btn\">\n        <button class=\"btn btn-default\" *ngIf=\"showClearButton\" (click)=\"clearSearch(searchTerm);\">Clear</button>\n        </span>\n      </div>\n    </div>    \n    "
        }),
        __param(0, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=searcher.js.map