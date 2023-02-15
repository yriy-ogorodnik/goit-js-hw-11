import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewsApiServece from './js/news-service';
import LoadMoreBtn from './js/load-more-btn';

let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('.search-form'),
  articlesContainer: document.querySelector('.gallery'),
  // loadMoreBtn: document.querySelector('.load-more'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

const newsApiServece = new NewsApiServece();

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  newsApiServece.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newsApiServece.searchQuery === '') {
    return Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
  }

  newsApiServece.resetPage();

  newsApiServece
    .fetchArticles()
    .then(hits => {
      clearArticlesContainer();

      return hits.reduce(
        (markup, article) => articlesTpl(article) + markup,
        ''
      );
    })
    .then(hits => {
      if (hits.length === 0) {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        loadMoreBtn.show();
        appendArticlesMarkup(hits);
        gallerySimpleLightbox.refresh(hits);
      }
    });
}
// ________________________LoadMore__________________
function onLoadMore() {
  loadMoreBtn.disable();
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
      loadMoreBtn.enable();
    });
}

// ________________________LoadMore__________________

function appendArticlesMarkup(a) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', a);
}
function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
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
