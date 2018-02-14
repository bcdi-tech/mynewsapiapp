import { Component } from '@angular/core';
import { NavController, NavParams, Loading, AlertController } from 'ionic-angular';

import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NewsApiService, StorageService, InAppBrowserService } from '../../services-list';
import * as _ from "lodash"
import * as moment from "moment"
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { ListPopoverPage, SettingsPage } from '../../pages-list';
import { Source, Article } from "../../models/api-models";

@Component({
	selector: 'page-list',
	templateUrl: 'list.html'
})
export class ListPage {
	public static CloseActions = {
		SortByDateAsc: "SortByDateAsc",
		SortByDateDesc: "SortByDateDesc",
		SortBySourceAsc: "SortBySourceAsc",
		SortBySourceDesc: "SortBySourceDesc"
	}

	public static FeedActions = {
		MakePreferred: "MakePreferred"
	}

	sortBy: string = ListPage.CloseActions.SortByDateDesc;
	prioritySources: string[];

	spinner: Loading;
	selectedItem: any;
	icons: string[];
	public articles: Article[];

	constructor(private navCtrl: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private newsApi: NewsApiService, private storage: StorageService, private browser: InAppBrowserService, private popoverCtrl: PopoverController) {
	}

	ionViewDidLoad() {
		this.pageLoad();
	}

	async pageLoad() {
		this.showSpinner();

		this.sortBy = await this.storage.get(this.storage.keys.lastSort)

		let prioritySources = await this.storage.get(this.storage.keys.prioritySources)
		if (prioritySources) {
			this.prioritySources = JSON.parse(prioritySources)
		} else {
			this.prioritySources = []
		}

		this.getTopStories()
			.then(() => {
				this.hideSpinner();
			})
			.catch(err => {
				if (`${err}` == "No API Key present!") {
					this.showPromptForApiKeySetup();
				} else {
					this.showAlert(`There was an error retrieving your top news items. Verify your API key and network connection or try again later.`)
				}
				this.hideSpinner();
			})
	}

	showPromptForApiKeySetup() {
		this.navCtrl.setRoot(SettingsPage);
	}

	refreshTopStories(refresher) {
		this.getTopStories()
			.then(() => {
				refresher.complete();
			}).catch(() => {
				refresher.complete();
			})
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

	getTopStories(): Promise<void> {
		return new Promise((resolve, reject) => {

			this.newsApi.getTopStories()
				.then(res => {
					this.articles = res.articles;
					this.performSort();
					let alreadySorted = true;
					this.filterForPreferences(alreadySorted);

					if (!this.articles)
						this.articles = res.articles;

					resolve();

				}).catch(err => reject(err));
		});
	}

	itemTapped(event, article: Article) {
		this.browser.launch(article.url)
	}

	showPopover(popoverEvent, article) {
		let popover = this.popoverCtrl.create(ListPopoverPage);
		popover.onDidDismiss((data) => { this.popoverDidDismiss(data); })
		popover.present({ ev: popoverEvent });
	}

	performSort() {
		switch (this.sortBy) {
			case ListPage.CloseActions.SortByDateAsc:
				this.articles = _.orderBy(this.articles, ['publishedAt'], ['asc'])
				break;
			case ListPage.CloseActions.SortByDateDesc:
				this.articles = _.orderBy(this.articles, ['publishedAt'], ['desc'])
				break;
			case ListPage.CloseActions.SortBySourceAsc:
				this.articles = _.orderBy(this.articles, ['source.name'], ['asc'])
				break;
			case ListPage.CloseActions.SortBySourceDesc:
				this.articles = _.orderBy(this.articles, ['source.name'], ['desc'])
				break;
			default:
				this.sortBy = ListPage.CloseActions.SortByDateDesc;
				this.articles = _.orderBy(this.articles, ['publishedAt'], ['desc'])
				break;
		}
		this.storage.set(this.storage.keys.lastSort, this.sortBy);
	}

	filterForPreferences(alreadySorted: boolean = false) {
		if (!this.articles)
			return;

		if (!alreadySorted)
			this.performSort();

		let priority = []
		let nonPriority = []

		this.articles.forEach(article => {
			try {
				if (article && article.source && article.source.name) {
					if (this.prioritySources && this.prioritySources.length > 0 && this.prioritySources.indexOf(article.source.name) > -1) {
						priority.push(article);
					} else {
						nonPriority.push(article);
					}
				}
			} catch (e) {
				console.error(`Error filtering: ${e}`)
				console.dir(article);
			}
		})

		this.articles = priority.concat(nonPriority);
	}

	public showAlert(msg?: string) {
		let alert = this.alertCtrl.create({ message: msg })
		alert.present();
	}


	private popoverDidDismiss(action) {
		switch (action) {
			case ListPage.CloseActions.SortByDateAsc:
			case ListPage.CloseActions.SortByDateDesc:
			case ListPage.CloseActions.SortBySourceAsc:
			case ListPage.CloseActions.SortBySourceDesc:
				this.sortBy = action;
				this.performSort();
				break;
			default:
				break;
		}
	}

	toFriendlyTime(time?: any): string {
		if (time) {
			var m = moment(time);
			let f = m.local().format("LLLL");
			return f;
		}
		return ""
	}
}
