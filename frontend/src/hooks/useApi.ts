import { useState, useCallback } from 'react';
import api from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(async (method: string, url: string, data?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api({
        method,
        url,
        data,
      });
      return response.data;
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { callApi, loading, error };
}; 