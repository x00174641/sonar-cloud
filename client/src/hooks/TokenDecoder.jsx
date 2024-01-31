import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useJwtDecode = (token) => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Failed to decode token', error);
        setDecodedToken(null);
      }
    } else {
      setDecodedToken(null);
    }
  }, [token]);

  return decodedToken;
};

export default useJwtDecode;
