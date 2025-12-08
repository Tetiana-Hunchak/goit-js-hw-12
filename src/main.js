
import './css/styles.css';
import 'izitoast/dist/css/iziToast.min.css';
import iziToast from 'izitoast';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');

let searchQuery = '';
let page = 1;
let totalHits = 0;


form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();

  const formEl = e.currentTarget;
  searchQuery = formEl.elements['search-text'].value.trim();
  if (!searchQuery) {
    iziToast.warning({
      message: 'Please enter a search term!',
      position: 'topRight',
    });
    return;
  }

  
  page = 1;
  clearGallery();
  hideLoadMoreButton();

  showLoader();

  try {
    const data = await getImagesByQuery(searchQuery, page);
    hideLoader();

    totalHits = data.totalHits;

    if (!data.hits.length) {
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    if (data.hits.length === 15) {
      showLoadMoreButton();
    }
  } catch (err) {
    
    iziToast.error({
      message: 'Error loading images. Try again later!',
      position: 'topRight',
    });
  } finally {
    
    hideLoader();
    formEl.reset();
  }
}



async function onLoadMore() {
  page += 1;

  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(searchQuery, page);
    hideLoader();

    createGallery(data.hits);

    scrollPage();

    const shownImages = document.querySelectorAll('.gallery-item').length;

    if (shownImages >= totalHits) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      hideLoadMoreButton();
      return;
    }

    showLoadMoreButton();
  } catch (err) {
    hideLoader();
    iziToast.error({
      message: 'Error loading images. Try again later!',
      position: 'topRight'
    });
  } finally {
    hideLoader();
  }
}



function scrollPage() {
  const card = document
    .querySelector('.gallery-item')
    .getBoundingClientRect().height;

  window.scrollBy({
    top: card * 2,
    behavior: 'smooth',
  });
}
