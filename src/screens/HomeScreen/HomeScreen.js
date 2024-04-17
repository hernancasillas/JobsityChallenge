import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {createShadow} from '../../constants/shadow';
import CountryFlag from 'react-native-country-flag';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSearch} from '../../hooks/useSearch';
//import debounce from 'just-debounce-it';
import {useShows} from '../../hooks/useShows';
import {TextInput} from 'react-native-paper';
export const HomeScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(304);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState(false);

  //const {search, updateSearch, errorOnSearch} = useSearch();
  const {searchShowsByName, shows, fetchShows, errorOnFetch} = useShows({
    search,
    sort,
    page,
  });

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
      fetchShows({pageNum: page, isNameEmpty: true});

      return;
    }
    const newSearch = text;

    //searchShowsByName({search});
    debouncedSearchShows(newSearch);
  };

  const handlePress = show => {
    console.log(show);
    navigation.navigate('DetailsScreen', {show: show});
  };

  const renderItem = useMemo(
    () =>
      ({item}) =>
        (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              handlePress(item);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '90%',
              borderWidth: 0,
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              style={[
                {
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  borderWidth: 0,
                  borderRadius: 20,
                  padding: 5,
                  backgroundColor: 'white',
                },
                createShadow(isDarkMode),
              ]}>
              <AntDesign name={'star'} size={20} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              {item.image ? (
                <Image
                  source={{uri: item.image.medium}}
                  style={{width: 100, height: 200, resizeMode: 'contain'}}
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
        ),
    [isDarkMode],
  );

  const [search, setSearch] = useState('');
  const [errorOnSearch, setOnErrorSearch] = useState(false);
  const [timeoutToClear, setTimeoutToClear] = useState();

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

  const debouncedSearchShows = debounce(searchShows, setSearchTextAlways, 200);

  return (
    <View style={{flex: 1, padding: 10}}>
      <TextInput
        label="Breaking Bad, The Walking Dead or their cast..."
        style={[
          {
            borderWidth: 0,
            backgroundColor: 'white',
            marginTop: 40,
            marginBottom: 10,

            paddingHorizontal: 10,
          },
          createShadow(isDarkMode),
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
      {errorOnSearch && (
        <View>
          <Text style={{color: 'red', marginHorizontal: 10}}>
            {errorOnSearch}
          </Text>
        </View>
      )}

      {loading && page === 1 ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{marginTop: 20}}
        />
      ) : (
        <FlatList
          data={shows}
          ref={flatListRef}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={() => {
            if (search === '') handleLoadMore;
          }}
          onEndReachedThreshold={0.1}
          ListEmptyComponent={() => (
            <View style={{alignItems: 'center'}}>
              <Text>Oops, there are no results for {search}.</Text>
            </View>
          )}
          ListFooterComponent={() => {
            if (loading && hasMore) {
              return (
                <View style={{marginTop: 20}}>
                  <ActivityIndicator size="large" color="#0000ff" />
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
      )}
    </View>
  );
};
