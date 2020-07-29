import {Injectable, Inject} from '@angular/core';
import {AbTestOptions, AbTestVersion} from './ab-test.module';
import {CookiesService} from '@ngx-utils/cookies/';

import {CONFIG} from './injection-tokens';

@Injectable()
export class AbTestsService {
    private _tests: { [x: string]: { versions: Array<string>, chosenVersion: string } } = {};
    private _errorMsg: string = 'Angular AbTests error';

    /**
     * Initialize ab test  config module. Check it for error and init version.
     * If cookie not defined - choose random version. If defined - get it from cookie
     *
     * @param {AbTestOptions[]} configs
     * @param {CookiesService} cookieService
     */
    constructor(@Inject(CONFIG) configs: AbTestOptions[], public cookieService: CookiesService) {
        for (const config of configs) {
            if (config.versions.length < 2) {
                this._error('You have to provide more then two versions in test <' + config.cookieName + '>');
            }
            const versionsNames: Array<string> = [];
            let totalPercent: number = 0;
            Object.keys(config.versions).forEach(function (key) {
                versionsNames.push(config.versions[key].name);
                totalPercent += config.versions[key].percent;
            });

            if (totalPercent !== 100) {
                this._error('Total percent in test <' + config.cookieName + '> is not correct, correct value: 100, your: ' + totalPercent);
            }
            const chosenVersion = this._getChosenVersion(config, versionsNames);
            this._tests[config.cookieName] = {versions: versionsNames, chosenVersion: chosenVersion};
        }
    }

    /**
     * Select needed version from *abTest decorator in html and show only chosen version of ab test
     *
     * @param version
     * @param cookieName
     * @returns {boolean}
     */
    shouldRender(version: string, cookieName: string): boolean {
        if (!this._tests[cookieName]) {
            this._error('Test with cookieName <' + cookieName + '> did not define');
            return false;
        }
        if (this._tests[cookieName].versions.indexOf(version) === -1) {
            this._error('Version <' + version + '> did not declare in list: [ ' + this._tests[cookieName].versions.join(', ') + ' ]');
            return false;
        }
        return version === this._tests[cookieName].chosenVersion;
    }

    /**
     * Prepare chosen version from cookie or random
     *
     * @param config
     * @param versionsNames
     * @returns {string}
     * @private
     */
    private _getChosenVersion(config: AbTestOptions, versionsNames: Array<string>): string {
        let chosenVersion = this.cookieService.get(config.cookieName);
        if (versionsNames.indexOf(chosenVersion) !== -1) {
            return chosenVersion;
        }
        chosenVersion = this._generateRandVersion(config.versions);
        this.cookieService.put(config.cookieName, chosenVersion);

        return chosenVersion;
    }

    /**
     * Generate random version of ab test
     *
     * @param versions
     * @returns {string}
     * @private
     */
    private _generateRandVersion(versions: Array<AbTestVersion>): string {
        const random: number = Math.random() * 100;
        let percentFrom: number = 0;
        let selectedVersion = '';
        Object.keys(versions).forEach(function (key) {
            const version: AbTestVersion = versions[key];
            if (random >= percentFrom && random < (percentFrom + version.percent)) {
                selectedVersion = version.name;
            }
            percentFrom += version.percent;
        });
        return selectedVersion;
    }

    /**
     * Generate error message in console for developers.
     *
     * @param msg
     * @private
     */
    private _error(msg: string) {
        throw (this._errorMsg + msg);
    }


}
