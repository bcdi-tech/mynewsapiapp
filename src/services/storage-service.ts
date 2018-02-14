import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable()
export class StorageService {
	public keys = {
		API_KEY: "API_KEY",
		blacklistSources: "blacklistSources",
		prioritySources: "prioritySources",
		lastSort: "lastSort",
		savedSourcesAsJson: "savedSources"
	}

	constructor(private storage: Storage) { }

	public get(key: string) {
		let result = this.storage.get(key);
		if (!result) {
			result = new Promise((resolve, reject) => {
				let item = window.localStorage.getItem(key);
				resolve(item);
			});
		}

		return result;
	}

	/**
	 * Returns array of key-value pairs
	 */
	public getAll(): Promise<any[]> {
		return new Promise((resolve, reject) => {
			let keyValues: any[] = [];
			this.storage.forEach((value, key, iterNum) => {
				keyValues.push({ "key": key, "value": value })
			});
			resolve(keyValues);
		});
	}

	/**
	 * Returns typed object from storage or error
	 * @param key 
	 */
	public getAs<T>(key: string): Promise<T> {
		return new Promise((resolve, reject) => {
			this.get(key)
				.then(json => {
					try {
						let obj: T = JSON.parse(json);
						if (!obj) {
							json = window.localStorage.getItem(key);
							if (json)
								obj = JSON.parse(json) as T;
						}
						resolve(obj);
					} catch (e) {
						reject(e.message);
					}
				})
				.catch(err => reject(err))
		});
	}

	/**
	 * Sets object value as JSON in storage. Pass in object
	 * @param key 
	 * @param value 
	 */
	public setAs<T>(key: string, value: T) {
		return new Promise((resolve, reject) => {
			try {
				let json = JSON.stringify(value);

				window.localStorage.setItem(key, json);

				this.storage.set(key, json)
					.then(() => resolve())
					.catch(err => reject(err));
			} catch (error) {
				reject(error.message);
			}
		});
	}

	public set(key: string, value: any) {
		let result = this.storage.set(key, value);
		window.localStorage.setItem(key, value);

		return result;
	}
	public remove(key: string) {
		let result = this.storage.remove(key);
		window.localStorage.removeItem(key);
		return result;
	}

	public clear() {
		window.localStorage.clear();
		return this.storage.clear()
	}
}