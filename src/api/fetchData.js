import axios from 'axios';

export const fetchData = async (api_key, routes) => {
  try {
    const res = await axios.get(api_key + routes);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
