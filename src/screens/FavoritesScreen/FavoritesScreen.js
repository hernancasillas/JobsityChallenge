import React, {useState, useMemo, useRef, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import CountryFlag from 'react-native-country-flag';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Checkbox} from 'react-native-paper';
import {useShowsContext} from '../../context/ShowsContext';
import Colors from '../../constants/colors';
import {useFocusEffect} from '@react-navigation/native';

export const FavoritesScreen = ({navigation, route}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#3b3b3b' : '#ebebeb',
  };

  const [sort, setSort] = useState(false);
  const [showImageNotFound, setShowImageNotFound] = useState(false);
  const [sortedFavorites, setSortedFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      // Screen is focused

      const previousScreen = route.state?.history[route.state?.index - 1]?.name;
      console.log('La pantalla anterior fue:', previousScreen);
      //setSort(false);
    }, []),
  );

  const {favorites} = useShowsContext();

  const flatListRef = useRef(null);

  const handlePress = show => {
    console.log(show);
    navigation.navigate('FavoritesDetailsScreen', {show: show});
  };

  const handleCheckboxChange = () => {
    setSort(!sort);
    if (!sort) {
      const newSortedFavorites = [...favorites].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      // Actualiza el estado de favorites con los favoritos ordenados alfabéticamente
      // Esto asumiría que setIsSorted setea el estado isSorted en el hook useShowsContext
      // Si setIsSorted no existe o no se necesita, puedes eliminar esa parte
      // Y simplemente actualizar el estado de favorites con los favoritos ordenados
      setSortedFavorites(newSortedFavorites);
    }
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

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          marginHorizontal: 20,
          marginTop: 20,
        }}>
        {'My Favorites'}
      </Text>
      {favorites.length > 0 && (
        <TouchableOpacity
          style={{
            marginTop: 20,
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-end',
          }}
          onPress={handleCheckboxChange}>
          <MaterialCommunityIcons
            name={'sort-alphabetical-ascending'}
            size={25}
          />
          <Checkbox
            status={sort ? 'checked' : 'unchecked'}
            onPress={handleCheckboxChange}
            color={Colors.star}
          />
        </TouchableOpacity>
      )}

      <FlatList
        data={sort ? sortedFavorites : favorites}
        ref={flatListRef}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => {}}
        maxToRenderPerBatch={25}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 100,
              borderWidth: 0,
            }}>
            <Text>You have no favorite shows yet!</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};
