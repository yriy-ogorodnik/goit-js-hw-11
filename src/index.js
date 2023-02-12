import axios from 'axios';
import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiServece from './js/news-service';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('.search-form'),
  articlesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const newsApiServece = new NewsApiServece();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  newsApiServece.searchQuery = e.currentTarget.elements.searchQuery.value;
  newsApiServece.resetPage();

  newsApiServece
    .fetchArticles()
    .then(hits => {
      return hits.reduce(
        (markup, article) => articlesTpl(article) + markup,
        ''
      );
    })
    .then(hits => {
      appendArticlesMarkup(hits);
      console.log('new', hits);
      gallerySimpleLightbox.refresh(hits);
    });
}

function onLoadMore() {
  newsApiServece
    .fetchArticles()
    .then(hits => {
      return hits.reduce(
        (markup, article) => articlesTpl(article) + markup,
        ''
      );
    })
    .then(hits => {
      appendArticlesMarkup(hits);
      gallerySimpleLightbox.refresh(hits);
    });
}

function appendArticlesMarkup(a) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', a);
}

function articlesTpl({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
   <div class="photo-card">
       <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-api"> ${likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-api">${views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-api">${comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-api">${downloads}</span> 
            </p>
        </div>
    </div>
   `;
}
