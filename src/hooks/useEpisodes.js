import {useState} from 'react';

export function useEpisodes() {
  const [episodesBySeason, setEpisodesBySeason] = useState([]);
  const [numberOfEpisodes, setNumberOfEpisodes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.tvmaze.com/shows/${id}/episodes`,
      );

      const data = await response.json();
      if (data.length > 0) {
        setNumberOfEpisodes(data.length);
        const groupedEpisodes = groupEpisodesBySeason(data);
        setEpisodesBySeason(groupedEpisodes);
      }

      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  };

  return {
    loading,
    errorOnFetch: error,
    fetchEpisodes,
    episodesBySeason,
    numberOfEpisodes,
    setLoading,
  };
}
