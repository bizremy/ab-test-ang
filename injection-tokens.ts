import {InjectionToken} from '@angular/core';
import {AbTestOptions} from './ab-test.module';

export const CONFIG = new InjectionToken<AbTestOptions[]>('AB_TEST_CONFIG');

