import { Component } from '@angular/core';
import { Loading, AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NewsApiService, StorageService, InAppBrowserService } from '../../services-list';
import * as _ from "lodash"
import { Source, Article } from "../../models/api-models";

@Component({
	selector: 'sources',
	templateUrl: 'sources.html'
})
export class SourcesPage {

	spinner: Loading
	apiSources: Source[];
	savedSources: Source[];

	loadingComplete: boolean;

	constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private newsApi: NewsApiService, private storage: StorageService, private browser: InAppBrowserService) {
	}

	ionViewDidLoad() {
		this.pageLoad();
	}

	async pageLoad() {
		this.loadingComplete = false;
		try {
			let sources = await this.newsApi.getSourcesFromApi();
			if (sources && sources.length > 0) {
				this.apiSources = sources;
				console.dir(this.apiSources)
			}

		} catch (e) {
			console.error(e)
			this.showAlert(`There was an error retrieving the sources. Verify your API key and network connection or try again later.`)
		}

		try {
			let savedSources = await this.newsApi.getSavedSources();
			if (savedSources && savedSources.length > 0) {
				this.savedSources = savedSources;
				console.dir(this.savedSources)
			}

		} catch (error) {
			console.error(error)
		}

		this.markedSavedSources();

		this.loadingComplete = true;
	}

	private markedSavedSources() {
		if (this.apiSources && this.apiSources.length > 0 && this.savedSources && this.savedSources.length > 0) {
			this.savedSources.forEach(saved => {
				for (let i = 0; i < this.apiSources.length; i ++) {
					let source = this.apiSources[i];
					if (source.id == saved.id) {
						this.apiSources[i].isSelected = true;
						break;
					}
				}
			})
		}
	}

	showSpinner() {
		this.hideSpinner();
		this.spinner = this.loadingCtrl.create({ duration: 15000 })
		this.spinner.present();
	}

	hideSpinner() {
		try {
			this.spinner.dismissAll();
			this.spinner = null;
		} catch (e) {
			this.spinner = null;
		}
	}

	openUrl(url: string) {
		this.browser.launch(url);
	}

	getCountSelected(): number {
		if (this.apiSources && this.apiSources.length > 0) {
			let count = 0;
			this.apiSources.forEach(source => {
				if (source.isSelected)
					count++;
			})
			return count;
		}
		return 0;
	}

	private showAlert(msg?: string) {
		let alert = this.alertCtrl.create({ message: msg })
		alert.present();
	}

	sourceCheckChanged(event, source) {
		if (this.getCountSelected() > 20) {
			this.showAlert("You cannot select more than 20 sources");
			this.apiSources.forEach(apiSource => {
				if (apiSource.id == source.id) {
					apiSource.isSelected = false;
					source.isSelected = false;
					event.checked = false;
				}
			})
		} else {
			this.savedSources = [];

			this.apiSources.forEach(apiSource => {
				if (apiSource.isSelected)
					this.savedSources.push(apiSource)
			})
			this.newsApi.saveSelectedSources(this.savedSources)
			.then(() => {

			}).catch(err => {
				this.showAlert(`Error saving selection ${err}`)
			})
		}
	}
}
