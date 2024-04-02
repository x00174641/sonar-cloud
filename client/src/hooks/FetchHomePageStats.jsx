import { useState, useEffect } from 'react';

const useFetchStatistics = () => {
  const [data, setData] = useState({ totalVideosClipped: 0, totalClips_Today: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.clipr.solutions:5000/statistics');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { data, isLoading, error };
};

export default useFetchStatistics;
