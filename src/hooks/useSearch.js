import {useEffect, useRef, useState} from 'react';

export function useSearch() {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null);

  const isFirstInput = useRef(true);

  useEffect(() => {
    console.log('SEARCH ON HOOK ====> ', search);
    if (isFirstInput.current) {
      isFirstInput.current = search === '';
      return;
    }

    if (search.length > 0 && search.length < 3) {
      setError('Search must have at least 3 characters.');
      return;
    }

    setError(null);
  }, [search]);

  return {search, updateSearch, errorOnSearch: error};
}
