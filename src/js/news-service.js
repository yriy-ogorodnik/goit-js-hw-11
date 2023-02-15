import axios from 'axios';
const API_KEY = '29588079-fbc492831fdad231bf7222b96';
const BASE_URL = 'https://pixabay.com/api';

// -------------клас-----------------------
export default class NewsApiServece {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchArticles() {
    console.log(this);
    return await fetch(
      `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${this.page}`
    )
      .then(r => r.json())
      .then(({ hits }) => {
        this.page += 1;
        return hits;
      });
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
