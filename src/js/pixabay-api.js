
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '53601534-4242f4726582a914ce6310b57';

export async function getImagesByQuery(query, page) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 15,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data; 
}
