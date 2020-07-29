import {Directive, OnInit, ViewContainerRef, TemplateRef, Input} from '@angular/core';
import {AbTestsService} from './ab-test.service';

@Directive({
    selector: '[abTest]'
})
export class AbTestDirective implements OnInit {
    private _version: string;
    private _name: string;

    /**

     * @param _service
     * @param _viewContainer
     * @param _templateRef
     */
    constructor(private _service: AbTestsService,
                private _viewContainer: ViewContainerRef,
                private _templateRef: TemplateRef<any>) {
    }

    ngOnInit() {
        //Check if abTest version need render. If need render with function createEmbeddedView
        if (this._service.shouldRender(this._version, this._name)) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
    }

    /**
     * set version and name from template *abTest
     *
     * @param value
     */
    @Input()
    set abTest(value: any) {
        this._version = value.version;
        this._name = value.name;
    }

}

