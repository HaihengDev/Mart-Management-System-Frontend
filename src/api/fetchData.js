import axios from 'axios';

export const fetchData = async (api_key) => {
  try {
    const res = await axios.get(api_key + '/api/products');
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
