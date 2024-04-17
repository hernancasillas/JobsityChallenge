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
import {useSearch} from '../../hooks/useSearch';
//import debounce from 'just-debounce-it';
import {useShows} from '../../hooks/useShows';
import {TextInput} from 'react-native-paper';
import {Skeleton} from 'moti/skeleton';
export const HomeScreen = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };

  const [page, setPage] = useState(304);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState(false);

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

  const SkeletonCommonProps = {
    /* transition: {
      type: 'timing',
      duration: 2000,
    }, */
  };

  const renderItem = ({item}) => (
    <Skeleton.Group show={loading && firstLoading}>
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
        {/* <TouchableOpacity TODO ADD TO FAVORITES
        style={[
          {
            position: 'absolute',
            top: 18,
            right: 8,
            borderWidth: 0,
            borderRadius: 20,
            padding: 5,
            backgroundColor: 'white',
          },
          createShadow(isDarkMode),
        ]}>
        <AntDesign name={'star'} size={20} />
      </TouchableOpacity> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Skeleton width={100} height={180} {...SkeletonCommonProps}>
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
          </Skeleton>

          <View style={{marginHorizontal: 20}}>
            <Skeleton width={200} height={30} {...SkeletonCommonProps}>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  width: 200,
                  borderWidth: 0,
                }}>
                {item.name}
              </Text>
            </Skeleton>
            <Skeleton width={100} height={25} {...SkeletonCommonProps}>
              <Text style={{fontSize: 16}}>
                {item.premiered
                  ? `${item.premiered.substring(0, 4)} - ${
                      item.ended ? item.ended.substring(0, 4) : 'Present'
                    }`
                  : 'N/A'}
              </Text>
            </Skeleton>
            {item.webChannel?.name && <Text>{item.webChannel.name}</Text>}
            {item.network?.country?.code || item.webChannel?.country?.code ? (
              <Skeleton width={30} height={25} {...SkeletonCommonProps}>
                <CountryFlag
                  isoCode={(
                    item.network?.country?.code ||
                    item.webChannel?.country?.code
                  ).toLocaleLowerCase()}
                  size={18}
                  style={{borderRadius: 5, marginVertical: 5}}
                />
              </Skeleton>
            ) : null}
          </View>
        </View>

        <View style={{}}>
          <Entypo name={'chevron-right'} size={30} />
        </View>
      </TouchableOpacity>
    </Skeleton.Group>
  ); //useMemo(
  // () =>

  //  [isDarkMode],
  // );

  const [search, setSearch] = useState('');
  const [errorOnSearch, setOnErrorSearch] = useState(false);
  const [timeoutToClear, setTimeoutToClear] = useState();

  const showsPlaceholderList = useMemo(() => {
    return Array.from({length: 15}).map((_, index) => ({id: index + 1}));
  }, []);

  useEffect(() => {
    console.log(shows.length > 0 && !firstLoading);
    console.log(shows.length);
    console.log(firstLoading);
    console.log(showsPlaceholderList);
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
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <TextInput
        label="Breaking Bad, The Walking Dead or their cast..."
        style={[
          {
            borderWidth: 0,

            marginTop: 40,
            marginBottom: 10,
            marginHorizontal: 20,
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
      {errorOnSearch && (
        <View>
          <Text style={{color: 'red', marginHorizontal: 10}}>
            {errorOnSearch}
          </Text>
        </View>
      )}

      <FlatList
        data={shows.length > 0 && !firstLoading ? shows : showsPlaceholderList}
        ref={flatListRef}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => {
          if (search === '') handleLoadMore;
        }}
        maxToRenderPerBatch={25}
        onEndReachedThreshold={0.1}
        /* ListEmptyComponent={() => (
          <View style={{alignItems: 'center'}}>
            <Text>Oops, there are no results for {search}.</Text>
          </View>
        )} */
        /* ListFooterComponent={() => {
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
        }} */
      />
    </SafeAreaView>
  );
};
