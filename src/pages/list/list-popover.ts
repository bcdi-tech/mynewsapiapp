import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";
import { ListPage } from "../../pages-list"

@Component({
	template: `
		<ion-list>
			<ion-item (click)="closeWithAction('${ListPage.CloseActions.SortByDateDesc}')">
				Newest
			</ion-item>
			<ion-item (click)="closeWithAction('${ListPage.CloseActions.SortByDateDesc}')">
				Oldest
			</ion-item>
			<ion-item (click)="closeWithAction('${ListPage.CloseActions.SortBySourceAsc}')">
				Source A-Z
			</ion-item>
			<ion-item (click)="closeWithAction('${ListPage.CloseActions.SortBySourceDesc}')">
				Source Z-A
			</ion-item>
		</ion-list>
	`
})
export class ListPopoverPage {

	constructor(private viewCtrl: ViewController) {

	}

	close(data?: any) {
		this.viewCtrl.dismiss(data);
	}

	closeWithAction(actionTarget) {
		this.close(actionTarget)
	}
}