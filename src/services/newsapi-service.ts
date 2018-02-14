import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { StorageService } from "./storage-service";
import { Source } from "../models/api-models";

@Injectable()
export class NewsApiService {

	private apiKey: string;
	private sources: string = "abc-news,al-jazeera-english,associated-press,axios,bbc-news,business-insider,buzzfeed,cbs-news,cnbc,cnn,engadget,google-news,hacker-news,msnbc,nbc-news,national-geographic,newsweek,reuters,reddit-r-all,the-new-york-times"

	constructor(private http: Http, private storage: StorageService) {

		this.storage.get(this.storage.keys.API_KEY).then(key => {
			this.apiKey = key;
		})

		this.refreshWithSavedSources();
	}

	private refreshWithSavedSources() {
		this.getSavedSources().then(saved => {
			if (saved && saved.length > 0) {
				let sources = [];
				saved.forEach(source => { sources.push(source.id)})
				this.sources = sources.join(",");
			}
		}).catch(err => { })
	}

	getTopStories(): Promise<any> {
		this.refreshWithSavedSources();
		return new Promise<any>((resolve, reject) => {
			this.storage.get(this.storage.keys.API_KEY).then(key => {
				this.apiKey = key;

				if (!this.apiKey)
					reject(`No API Key present!`);

				this.http.get(`https://newsapi.org/v2/top-headlines?apiKey=${this.apiKey}&sources=${this.sources}&pageSize=100`)
					.map(data => {
						if (data && data.text())
							return JSON.parse(data.text())

						return null
					})
					.catch(err => this.handleError(err, `Error top stories`))
					.subscribe(resp => {
						resolve(resp)
					}, err => {
						reject(err)
					})
			}).catch(err => {
				reject(`Error fetching API Key: ${err}`);
			})
		});

	}

	getSourcesFromApi(): Promise<Source[]> {
		return new Promise<Source[]>((resolve, reject) => {
			this.storage.get(this.storage.keys.API_KEY).then(key => {
				this.apiKey = key;

				if (!this.apiKey)
					reject(`No API Key present!`);

				this.http.get(`https://newsapi.org/v2/sources?apiKey=${this.apiKey}`)
					.map(data => {
						if (data && data.text()) {
							let resp = JSON.parse(data.text())
							console.dir(resp)
							return resp.sources;
						}

						return null
					})
					.catch(err => this.handleError(err, `Error get sources`))
					.subscribe(resp => {
						resolve(resp)
					}, err => {
						reject(err)
					})
			}).catch(err => {
				reject(`Error fetching API Key: ${err}`);
			})
		});
	}

	getSavedSources(): Promise<Source[]> {
		return new Promise<Source[]>((resolve, reject) => {
			this.storage.get(this.storage.keys.savedSourcesAsJson)
			.then(json => {
				if (json && json.length > 0) {
					try {
						let saved = JSON.parse(json) as Source[]
						return resolve(saved)
					} catch (e) {
						return reject(e);
					}
				} else {
					return resolve([])
				}
			})
			.catch(err => { return reject(err); })
		})
	}

	saveSelectedSources(selectedSources: Source[]): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			try {
				let sourcesAsJson = JSON.stringify(selectedSources);
				this.storage.set(this.storage.keys.savedSourcesAsJson, sourcesAsJson)
				return resolve(true)
			} catch(e) {
				return reject(e)
			}
		})
	}


	public handleError(error: any, message: string = "") {
		let errorMessage = `${message}  Error: ${JSON.stringify(error)}`;
		return Observable.throw(errorMessage || 'Server error');
	}

}