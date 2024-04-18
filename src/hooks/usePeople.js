import {useRef, useState, useCallback, useMemo} from 'react';
// TODO SERVICE FOR people import {searchPeople, getPeopleByPage} from '../services/people';
export function usePeople({search, sort, currentPage}) {
  const [people, setPeople] = useState([]);
  const [episodesBySeason, setEpisodesBySeason] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoading, setFirstLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPageValid, setIsPageValid] = useState(true);
  const [castCredits, setCastCredits] = useState([]);
  const [crewCredits, setCrewCredits] = useState([]);

  const previousSearch = useRef(search);

  const fetchPeople = async ({search, isNameEmpty}) => {
    setFirstLoading(false);
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/people?q=${search}`,
      );

      const data = await response.json();
      if (data.length > 0) {
        setPeople(data.map(entry => entry.person));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching people:', error);
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

  const fetchCredits = async ({id}) => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.tvmaze.com/people/${id}?embed[]=crewcredits&embed[]=castcredits`,
      );

      const data = await response.json();

      setCrewCredits(data._embedded.crewcredits);
      setCastCredits(data._embedded.castcredits);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching people:', error);
      setLoading(false);
    }
  };

  const searchPeopleByName = async ({search}) => {
    if (search === previousSearch.current) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.tvmaze.com/search/people?q=${search}`,
      );
      previousSearch.current = search;

      const data = await response.json();

      setPeople(data.map(entry => entry.people));
      setLoading(false);
    } catch (error) {
      console.error('Error searching people:', error);
      setLoading(false);
    }
  };

  const sortedPeople = useMemo(() => {
    return sort
      ? [...people].sort((a, b) => a.title.localeCompare(b.title))
      : people;
  }, [sort, people]);

  return {
    loading,
    errorOnFetch: error,
    people,
    searchPeopleByName,
    fetchPeople,
    fetchCredits,
    episodesBySeason,
    firstLoading,
    castCredits,
    crewCredits,
  };
}
