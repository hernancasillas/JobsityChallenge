import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import {createShadow} from '../../constants/shadow';
import CountryFlag from 'react-native-country-flag';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSearch} from '../../hooks/useSearch';
//import debounce from 'just-debounce-it';
import {useShows} from '../../hooks/useShows';
import {Checkbox, TextInput} from 'react-native-paper';
import {useShowsContext} from '../../context/ShowsContext';
import Colors from '../../constants/colors';
import {usePeople} from '../../hooks/usePeople';
import moment from 'moment';

export const HomeScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState(false);
  const [showImageNotFound, setShowImageNotFound] = useState(false);
  const [searchPeople, setSearchPeople] = useState(false);

  //const {search, updateSearch, errorOnSearch} = useSearch();
  const {
    searchShowsByName,
    shows,
    fetchShows,
    errorOnFetch,
    loading,
    firstLoading,
  } = useShows({
    search,
    sort,
    page,
  });

  const {fetchPeople, people} = usePeople({search});

  const {favorites} = useShowsContext();

  const debounce = (callback, alwaysCall, ms) => {
    return (...args) => {
      alwaysCall(...args);
      clearTimeout(timeoutToClear);
      setTimeoutToClear(
        setTimeout(() => {
          callback(...args);
        }, ms),
      );
    };
  };

  const flatListRef = useRef(null);

  const handleLoadMore = () => {
    console.log('loadingMore');
    if (!loading && hasMore && search === '') {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchShows({pageNum: page});
  }, [page]);

  const handleChange = text => {
    console.log('handleChange ===> ', text);

    if (text === '') {
      console.log('dentro del if text ===== ', text);
      setSearch('');
      if (!searchPeople) fetchShows({pageNum: page, isNameEmpty: true});

      return;
    }
    const newSearch = text;

    //searchShowsByName({search});
    if (!searchPeople) debouncedSearchShows(newSearch);
    else debouncedSearchPeople(newSearch);
  };

  const handlePressShow = show => {
    console.log(show);

    navigation.navigate('DetailsScreen', {show: show});
  };
  const handlePressPerson = person => {
    console.log(person);

    navigation.navigate('PersonDetailsScreen', {person: person});
  };

  const renderItem = useMemo(
    () =>
      ({item}) => {
        const isFavorite = favorites.some(favorite => favorite.id === item.id);

        const handleToggleFavorite = () => {
          if (isFavorite) {
            removeFromFavorites(item.id);
          } else {
            addToFavorites(item);
          }
        };

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              handlePressShow(item);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              borderWidth: 0,
              alignSelf: 'center',
            }}>
            <View style={{position: 'absolute', top: 30, right: 0}}>
              <AntDesign
                name={isFavorite ? 'star' : 'staro'}
                size={24}
                color={isFavorite ? Colors.star : null}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {item.image && !showImageNotFound ? (
                <Image
                  source={{uri: item.image.medium}}
                  style={{width: 100, height: 200, resizeMode: 'contain'}}
                  onLoad={() => setShowImageNotFound(false)}
                  onError={() => setShowImageNotFound(true)}
                />
              ) : (
                <View
                  style={{
                    width: 100,
                    height: 200,
                    borderWidth: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <MaterialIcons name={'image-not-supported'} size={50} />
                </View>
              )}

              <View style={{marginHorizontal: 20}}>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    width: 200,
                    borderWidth: 0,
                  }}>
                  {item.name}
                </Text>

                <Text style={{fontSize: 16}}>
                  {item.premiered
                    ? `${item.premiered.substring(0, 4)} - ${
                        item.ended ? item.ended.substring(0, 4) : 'Present'
                      }`
                    : 'N/A'}
                </Text>

                {item.webChannel?.name && <Text>{item.webChannel.name}</Text>}
                {item.network?.country?.code ||
                item.webChannel?.country?.code ? (
                  <CountryFlag
                    isoCode={(
                      item.network?.country?.code ||
                      item.webChannel?.country?.code
                    ).toLocaleLowerCase()}
                    size={18}
                    style={{borderRadius: 5, marginVertical: 5}}
                  />
                ) : null}
              </View>
            </View>

            <View style={{}}>
              <Entypo name={'chevron-right'} size={30} />
            </View>
          </TouchableOpacity>
        );
      },
    [favorites, isDarkMode],
  );
  const renderPerson = useMemo(
    () =>
      ({item}) => {
        const isFavorite = favorites.some(favorite => favorite.id === item.id);

        const handleToggleFavorite = () => {
          if (isFavorite) {
            removeFromFavorites(item.id);
          } else {
            addToFavorites(item);
          }
        };

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              handlePressPerson(item);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              borderWidth: 0,
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {item.image && !showImageNotFound ? (
                <Image
                  source={{uri: item.image.medium}}
                  style={{width: 100, height: 200, resizeMode: 'contain'}}
                  onLoad={() => setShowImageNotFound(false)}
                  onError={() => setShowImageNotFound(true)}
                />
              ) : (
                <View
                  style={{
                    width: 100,
                    height: 200,
                    borderWidth: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <MaterialIcons name={'image-not-supported'} size={50} />
                </View>
              )}

              <View style={{marginHorizontal: 20}}>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: 'bold',
                    width: 200,
                    borderWidth: 0,
                  }}>
                  {item.name}
                </Text>

                <Text style={{fontSize: 16}}>
                  {item.birthday
                    ? item.deathday
                      ? `${moment(item.birthday).format(
                          'MMM DD, YYYY',
                        )} - ${moment(item.deathday).format('MMM DD, YYYY')}`
                      : `${moment(item.birthday).format('MMM DD, YYYY')}`
                    : 'N/A'}
                </Text>

                {item.country?.code && (
                  <CountryFlag
                    isoCode={(item.country?.code).toLocaleLowerCase()}
                    size={18}
                    style={{borderRadius: 5, marginVertical: 5}}
                  />
                )}
              </View>
            </View>

            <View style={{}}>
              <Entypo name={'chevron-right'} size={30} />
            </View>
          </TouchableOpacity>
        );
      },
    [favorites, isDarkMode],
  );

  const [search, setSearch] = useState('');
  const [errorOnSearch, setOnErrorSearch] = useState(false);
  const [timeoutToClear, setTimeoutToClear] = useState();

  const showsPlaceholderList = useMemo(() => {
    return Array.from({length: 15}).map((_, index) => ({id: index + 1}));
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutToClear);
    };
  }, []);

  const setSearchTextAlways = text => {
    setSearch(text);
  };

  const searchShows = async text => {
    console.log('ready to searchShows text ===>', text);
    setSearch(text);
    searchShowsByName({search: text});
  };

  const searchPeopleFn = async text => {
    console.log('ready to searchPeople text ===>', text);
    setSearch(text);
    fetchPeople({search: text});
  };

  const debouncedSearchShows = debounce(searchShows, setSearchTextAlways, 200);
  const debouncedSearchPeople = debounce(
    searchPeopleFn,
    setSearchTextAlways,
    200,
  );

  const handleCheckboxChange = () => {
    setSearch('');
    setSearchPeople(!searchPeople);
  };

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 30,
          marginBottom: 10,
          marginHorizontal: 20,
        }}>
        <TextInput
          label={
            !searchPeople
              ? 'Breaking Bad, Suits, Attack on Titan...'
              : 'Bryan Cranston, Brad Pitt, DiCaprio...'
          }
          activeUnderlineColor={Colors.star}
          style={[
            {
              borderWidth: 0,
              width: '70%',

              paddingHorizontal: 10,
            },
            createShadow(isDarkMode),
            backgroundStyle,
          ]}
          error={errorOnSearch}
          value={search}
          right={
            search && (
              <TextInput.Icon
                onPress={() => {
                  handleChange('');
                }}
                icon="close-circle"
                color={'grey'}
              />
            )
          }
          onChangeText={text => handleChange(text)}
          //value={search}
        />
        {!loading && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleCheckboxChange}>
            <MaterialCommunityIcons name={'account-search'} size={25} />
            <Checkbox
              status={searchPeople ? 'checked' : 'unchecked'}
              onPress={handleCheckboxChange}
              color={Colors.star}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorOnSearch && (
        <View>
          <Text style={{color: 'red', marginHorizontal: 10}}>
            {errorOnSearch}
          </Text>
        </View>
      )}

      <FlatList
        data={!searchPeople ? shows : people}
        ref={flatListRef}
        renderItem={!searchPeople ? renderItem : renderPerson}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => {
          console.log('onEndReached');
          if (search === '' && !searchPeople) {
            handleLoadMore();
          } else console.log('el search parece no estar vacio ', search);
        }}
        maxToRenderPerBatch={25}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => (
          <View style={{alignItems: 'center'}}>
            <Text>Oops, there are no results for {search}.</Text>
          </View>
        )}
        ListFooterComponent={() => {
          if (loading && hasMore) {
            return (
              <View style={{marginVertical: 20}}>
                <ActivityIndicator size="large" color={Colors.star} />
              </View>
            );
          } else if (errorOnFetch) {
            return (
              <TouchableOpacity
                onPress={() => {
                  flatListRef.current.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                }}
                style={{alignItems: 'center', margin: 20}}>
                <Text style={{color: 'grey'}}>{errorOnFetch}</Text>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        }}
      />
    </SafeAreaView>
  );
};
