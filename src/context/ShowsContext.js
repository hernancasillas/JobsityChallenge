import React, {createContext, useContext, useEffect, useState} from 'react';
import {MMKV} from 'react-native-mmkv';

const ShowsContext = createContext();

export const ShowsProvider = ({children}) => {
  const storage = new MMKV();

  const [shows, setShows] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = show => {
    setFavorites([...favorites, show]);
  };

  const removeFromFavorites = id => {
    setFavorites(favorites.filter(movie => movie.id !== id));
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await storage.getString('favorites');

        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from MMKV:', error);
      }
    };

    loadFavorites();

    return () => {};
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await storage.set('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to MMKV:', error);
      }
    };

    saveFavorites();
  }, [favorites]);

  return (
    <ShowsContext.Provider
      value={{
        shows,
        favorites,
        addToFavorites,
        removeFromFavorites,
      }}>
      {children}
    </ShowsContext.Provider>
  );
};

export const useShowsContext = () => useContext(ShowsContext);
