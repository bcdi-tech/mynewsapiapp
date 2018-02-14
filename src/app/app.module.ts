import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { ListPage, SettingsPage, ListPopoverPage, SourcesPage } from '../pages-list';
import { NewsApiService, StorageService, InAppBrowserService } from '../services-list';


@NgModule({
  declarations: [
    MyApp,
	ListPage,
	SettingsPage,
	ListPopoverPage,
	SourcesPage

  ],
  imports: [
	BrowserModule,
	HttpModule,
	IonicModule.forRoot(MyApp),
	IonicStorageModule.forRoot({
		name: '__MyNewsApi',
		driverOrder: [ 'sqlite', 'indexeddb', 'websql', 'localstorage' ]
	})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
	ListPage,
	SettingsPage,
	ListPopoverPage,
	SourcesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: NewsApiService, useClass: NewsApiService},
	{provide: StorageService, useClass: StorageService},
	{provide: InAppBrowserService, useClass: InAppBrowserService}

  ]
})
export class AppModule {}
