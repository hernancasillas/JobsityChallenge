import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {MMKV} from 'react-native-mmkv';
// Creamos un contexto para el estado de las películas y la lista de favoritos
const ShowsContext = createContext();

// Proveedor de contexto para envolver los componentes y proporcionar acceso al estado y funciones
export const ShowsProvider = ({children}) => {
  const storage = new MMKV();

  const [shows, setShows] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Función para agregar una película a la lista de favoritos
  const addToFavorites = show => {
    setFavorites([...favorites, show]);
  };

  // Función para quitar una película de la lista de favoritos
  const removeFromFavorites = id => {
    setFavorites(favorites.filter(movie => movie.id !== id));
  };

  useEffect(() => {
    // Cargar favoritos desde MMKV al montar el componente
    const loadFavorites = async () => {
      try {
        const storedFavorites = await storage.getString('favorites');
        //console.log('🚀 ~ loadFavorites ~ storedFavorites:', storedFavorites);

        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from MMKV:', error);
      }
    };

    loadFavorites();

    // Eliminar la subscripción al desmontar el componente
    return () => {
      // Aquí puedes realizar limpieza si es necesario
    };
  }, []);

  useEffect(() => {
    // Guardar favoritos en MMKV cuando cambie
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

// Hook personalizado para acceder al contexto de películas y favoritos
export const useShowsContext = () => useContext(ShowsContext);
