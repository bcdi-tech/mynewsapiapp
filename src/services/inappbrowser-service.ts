import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular'

@Injectable()
export class InAppBrowserService {

	constructor(public platform: Platform, private iab: InAppBrowser) { }

	launch(url: string, target?: string, options?: string) {
		if (!target || target.length < 1) target = '_system';
		if (!options || options.length < 1) options = 'location=no';

		try {
			this.platform.ready().then(() => {
				// tslint:disable-next-line
				const browser = this.iab.create(url, target, options)
			});
		} catch (e) {
			let error = e.message;
			alert("Error opening external website");
		}
	}
}
