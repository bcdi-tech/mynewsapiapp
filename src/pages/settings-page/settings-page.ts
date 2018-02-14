import { Component } from '@angular/core';
import { StorageService } from '../../services/storage-service';
import { NavController, AlertController } from 'ionic-angular';
import { InAppBrowserService } from '../../services-list';

@Component({
	selector: 'page-settings',
	templateUrl: 'settings-page.html'
})
export class SettingsPage {

	public apiKey: string;

	constructor(private storage: StorageService, private navCtrl: NavController, private alertCtrl: AlertController, private browser: InAppBrowserService) {

	}

	ionViewDidLoad() {
		this.loadPage()
	}

	async loadPage() {
		try {
			this.apiKey = await this.storage.get(this.storage.keys.API_KEY)
		} catch (e) {
			this.apiKey = null
		}
	}

	saveSettings() {
		this.storage.set(this.storage.keys.API_KEY, this.apiKey).then(() => {
			this.showAlert(`Saved!`)
		})
	}

	launchNewsApi() {
		this.browser.launch("https://newsapi.org/")
	}

	launchRegister() {
		this.browser.launch("https://newsapi.org/register")
	}

	showTos() {
		this.browser.launch("https://newsapi.org/terms")
	}

	showAlert(msg?: string) {
		let alert = this.alertCtrl.create({ message: msg })
		alert.present()
	}

}