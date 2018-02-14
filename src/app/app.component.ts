import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ListPage, SettingsPage, SourcesPage } from '../pages-list';
import { InAppBrowserService } from '../services-list';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = ListPage;

	pages: Array<{ title: string, component: any }>;

	constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private browser: InAppBrowserService) {
		this.initializeApp();

		this.pages = [
			{ title: 'Top Stories', component: ListPage },
			{ title: 'Sources', component: SourcesPage },
			{ title: 'Settings', component: SettingsPage }
		];

	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	openPage(page) {
		this.nav.setRoot(page.component);
	}

	openNewsApiWebsite() {
		this.browser.launch("https://newsapi.org")
	}

	showTos() {
		this.browser.launch("https://newsapi.org/terms")
	}
}
