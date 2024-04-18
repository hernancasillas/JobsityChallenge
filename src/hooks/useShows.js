import {useRef, useState, useMemo} from 'react';
// TODO SERVICE FOR SHOWS import {searchShows, getShowsByPage} from '../services/shows';
export function useShows({search, sort, currentPage}) {
  const [shows, setShows] = useState([]);
  const [show, setShow] = useState({});
  const [episodesBySeason, setEpisodesBySeason] = useState([]);
  const [loading, setLoadingShow] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPageValid, setIsPageValid] = useState(true);
  const [numberOfEpisodes, setNumberOfEpisodes] = useState(0);

  const previousSearch = useRef(search);

  const fetchShows = async ({pageNum, isNameEmpty}) => {
    setFirstLoading(false);
    setLoadingShow(true);
    if (!isPageValid) {
      setError('There are no more shows to look for.');

      return;
    }
    try {
      const response = await fetch(
        `https://api.tvmaze.com/shows?page=${pageNum}`,
      );

      const data = await response.json();
      if (data.length > 0) {
        if (!isNameEmpty) setShows(prevShows => [...prevShows, ...data]);
        else setShows(data);
      }

      setLoadingShow(false);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setLoadingShow(false);
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

  const groupEpisodesBySeasonFromEmbedded = episodes => {
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
    try {
      setLoadingShow(true);

      const response = await fetch(
        `https://api.tvmaze.com/shows/${id}/episodes`,
      );

      const data = await response.json();
      if (data.length > 0) {
        const groupedEpisodes = groupEpisodesBySeason(data);
        setEpisodesBySeason(groupedEpisodes);
      }

      setLoadingShow(false);
    } catch (error) {
      console.error('Error fetching shows:', error);
      setLoadingShow(false);
    }
  };

  const searchShowsByName = async ({search}) => {
    if (search === previousSearch.current) return;

    try {
      setLoadingShow(true);
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${search}`,
      );
      previousSearch.current = search;

      const data = await response.json();

      setShows(data.map(entry => entry.show));
      setLoadingShow(false);
    } catch (error) {
      console.error('Error searching shows:', error);
      setLoadingShow(false);
    }
  };

  const fetchShowById = async ({search}) => {
    try {
      setLoadingShow(true);
      const response = await fetch(
        `https://api.tvmaze.com/shows/${search}?embed=episodes`,
      );
      previousSearch.current = search;

      const data = await response.json();

      const groupedEpisodes = groupEpisodesBySeasonFromEmbedded(
        data._embedded.episodes,
      );

      setNumberOfEpisodes(data._embedded.episodes.length);
      setEpisodesBySeason(groupedEpisodes);

      setShow(data);
      setLoadingShow(false);
    } catch (error) {
      console.error('Error searching shows:', error);
      setLoadingShow(false);
    }
  };

  const sortedShows = useMemo(() => {
    return sort
      ? [...shows].sort((a, b) => a.title.localeCompare(b.title))
      : shows;
  }, [sort, shows]);

  return {
    loadingShow: loading,
    errorOnFetch: error,
    shows,
    searchShowsByName,
    fetchShows,
    fetchEpisodes,
    fetchShowById,
    setLoadingShow,
    showById: show,
    episodesBySeasonFromShow: episodesBySeason,
    firstLoading,
    numberOfEpisodesFromShow: numberOfEpisodes,
  };
}
