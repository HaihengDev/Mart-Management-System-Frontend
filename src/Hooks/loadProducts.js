import { useEffect, useState } from 'react';
import { fetchData } from '../api/fetchData.js';

export default function useLoadProducts() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const data = await fetchData(
          import.meta.env.VITE_API_KEY,
          '/api/products',
        );
        if (!isMounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load products.');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { items, isLoading, error };
}
