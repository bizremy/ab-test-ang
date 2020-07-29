import {NgModule, ModuleWithProviders} from '@angular/core';
import {AbTestsService} from './ab-test.service';
import {CONFIG} from './injection-tokens';

export interface AbTestOptions {
    versions: Array<AbTestVersion>;
    cookieName: string;
    expiration?: number;
}
export interface AbTestVersion {
    name: string;
    percent: number;
}

@NgModule({
    declarations: [],
    exports: []
})
export class AbTestsModule {
    static forRoot(configs: AbTestOptions[]): ModuleWithProviders {
        return {
            ngModule: AbTestsModule,
            providers: [
                AbTestsService,
                {provide: CONFIG, useValue: configs},
            ],
        };
    }
}

