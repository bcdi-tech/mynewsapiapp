export class Source {
	id: string
	name: string
	description: string
	url: string
	category: string
	language: string
	country: string
	isSelected: boolean
}

export class Article {
	title: string;
	url: string;
	urlToImage: string;
	publishedAt: Date;
	description: string;
	author: string;
	source: Source;
}