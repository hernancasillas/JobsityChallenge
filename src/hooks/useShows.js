import {useRef, useState, useCallback, useMemo} from 'react';
// TODO SERVICE FOR SHOWS import {searchShows, getShowsByPage} from '../services/shows';
import {Alert} from 'react-native';
export function useShows({search, sort, currentPage}) {
  const [shows, setShows] = useState([]);
  const [episodesBySeason, setEpisodesBySeason] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPageValid, setIsPageValid] = useState(true);

  const previousSearch = useRef(search);

  const fetchShows = async ({pageNum, isNameEmpty}) => {
    console.log('I am fetching shows by page');
    if (!isPageValid) {
      console.log('Estoy en el error');
      setError('There are no more shows to look for.');
      //Alert.alert('Reached end');
      return;
    }
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.tvmaze.com/shows?page=${pageNum}`,
      );
      console.log(`https://api.tvmaze.com/shows?page=${pageNum}`);
      const data = await response.json();
      if (data.length > 0) {
        console.log(data);
        if (!isNameEmpty) setShows(prevShows => [...prevShows, ...data]);
        else setShows(data);
      } /* else {
        setIsPageValid(false);
      } */

      setLoading(false);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setLoading(false);
    }
  };

  const groupEpisodesBySeason = episodes => {
    return episodes.reduce((acc, episode) => {
      const season = episode.season;
      if (!acc[season]) {
        acc[season] = [];
      }
      acc[season].push(episode);
      return acc;
    }, {});
  };

  const fetchEpisodes = async ({id}) => {
    console.log('I am fetching episodes');

    try {
      setLoading(true);

      const response = await fetch(
        `https://api.tvmaze.com/shows/${id}/episodes`,
      );
      console.log(`https://api.tvmaze.com/shows/${id}/episodes`);
      const data = await response.json();
      if (data.length > 0) {
        console.log(data);
        const groupedEpisodes = groupEpisodesBySeason(data); // Llamada a la función para agrupar episodios por temporada
        setEpisodesBySeason(groupedEpisodes);
      } /* else {
        setIsPageValid(false);
      } */

      setLoading(false);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setLoading(false);
    }
  };

  const searchShowsByName = async ({search}) => {
    if (search === previousSearch.current) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${search}`,
      );
      previousSearch.current = search;
      console.log(
        `Voy a buscar en searchShowsByName ===> https://api.tvmaze.com/search/shows?q=${search}`,
      );
      const data = await response.json();
      // console.log(data.map(entry => entry.show));
      setShows(data.map(entry => entry.show));
      setLoading(false);
    } catch (error) {
      console.error('Error searching shows:', error);
      setLoading(false);
    }
  };

  const sortedShows = useMemo(() => {
    return sort
      ? [...shows].sort((a, b) => a.title.localeCompare(b.title))
      : shows;
  }, [sort, shows]);

  return {
    loading,
    errorOnFetch: error,
    shows,
    searchShowsByName,
    fetchShows,
    fetchEpisodes,
    episodesBySeason,
  };
}
