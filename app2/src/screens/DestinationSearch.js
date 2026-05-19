import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BottomSheet, {
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

const GOOGLE_DIRECTIONS_API_KEY = '';

import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

export default function DestinationSearch({ navigation }) {
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [originText, setOriginText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [sheetIndex, setSheetIndex] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const insets = useSafeAreaInsets();
  const searchTimeoutRef = useRef(null);

  const snapPoints = useMemo(
    () => [height * 0.34, height - insets.top],
    [insets.top]
  );

  // Garantir que o BottomSheet abra no topo ao montar a tela
  useEffect(() => {
    // pequeno timeout para garantir que o ref esteja pronto
    const t = setTimeout(() => {
      try {
        bottomSheetRef.current?.snapToIndex(snapPoints.length - 1);
        setSheetIndex(snapPoints.length - 1);
      } catch (e) {
        // ignore
      }
    }, 50);

    return () => clearTimeout(t);
  }, [snapPoints]);

  useEffect(() => {
    let isMounted = true;

    async function requestLocationPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationGranted(false);
        return;
      }

      if (!isMounted) {
        return;
      }

      setLocationGranted(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      if (isMounted && location?.coords) {
        setCurrentLocation(location.coords);
      }
    }

    requestLocationPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800
      );
    }
  }, [currentLocation]);

  useEffect(() => {
    if (currentLocation && destinationLocation && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [currentLocation, destinationLocation],
        {
          edgePadding: {
            top: 80,
            right: 60,
            bottom: 280,
            left: 60,
          },
          animated: true,
        }
      );
    }
  }, [currentLocation, destinationLocation]);

  useEffect(() => {
    let isMounted = true;

    async function fillOrigin() {
      if (!currentLocation || !isMounted) return;

      try {
        const [result] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });

        if (!isMounted) return;

        // Only auto-fill if user hasn't typed an origin yet
        if (!originText) {
          let formatted = '';

          if (result.street) {
            formatted = result.street;

            // prefer a number or name after the street
            if (result.name && result.name !== result.street) {
              formatted += `, ${result.name}`;
            } else if (result.streetNumber) {
              formatted += `, ${result.streetNumber}`;
            }
          } else if (result.name) {
            formatted = result.name;
          }

          if (!formatted && result.city) formatted = result.city;

          setOriginText(formatted || 'Minha localização');
        }
      } catch (e) {
        // fallback to coords
        if (!originText && currentLocation) {
          setOriginText(`${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`);
        }
      }
    }

    fillOrigin();

    return () => {
      isMounted = false;
    };
  }, [currentLocation]);

  useEffect(() => {
    // Mantém o bottom sheet no topo durante a digitação e enquanto busca resultados
    if (activeField) {
      bottomSheetRef.current?.snapToIndex(snapPoints.length - 1);
    }
  }, [activeField, loadingSearch, searchResults, snapPoints]);

  function handleCenterOnUser() {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    }
  }

  function handleOriginFocus() {
    setActiveField('origin');
    bottomSheetRef.current?.snapToIndex(snapPoints.length - 1);
    if (originInputRef.current && originText) {
      originInputRef.current.selectAll?.();
    }
  }

  function handleDestinationFocus() {
    setActiveField('destination');
    bottomSheetRef.current?.snapToIndex(snapPoints.length - 1);
    if (destinationInputRef.current && destinationText) {
      destinationInputRef.current.selectAll?.();
    }
  }

  function handleSelectPlace(place) {
    if (activeField === 'origin') {
      setOriginText(place.title);
    } else if (activeField === 'destination') {
      setDestinationText(place.title);
      if (place.latitude != null && place.longitude != null) {
        setDestinationLocation({
          latitude: place.latitude,
          longitude: place.longitude,
        });
      }
    }
    setActiveField(null);
  }

  useEffect(() => {
    if (currentLocation && destinationLocation) {
      fetchRoute(currentLocation, destinationLocation);
    } else {
      setRouteCoordinates([]);
    }
  }, [currentLocation, destinationLocation]);

  // Calcula distância entre dois pontos em km
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  function decodePolyline(encoded) {
    const coordinates = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let shift = 0;
      let result = 0;
      let byte;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;

      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      const deltaLon = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += deltaLon;

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return coordinates;
  }

  async function fetchRoute(origin, destination) {
    if (!origin || !destination) {
      setRouteCoordinates([]);
      return;
    }

    const apiKey = GOOGLE_DIRECTIONS_API_KEY?.trim();
    if (!apiKey) {
      setRouteCoordinates([]);
      return;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&departure_time=now&traffic_model=best_guess&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === 'OK' && data.routes?.length) {
        const overviewPolyline = data.routes[0].overview_polyline?.points;
        if (overviewPolyline) {
          const decodedRoute = decodePolyline(overviewPolyline);
          setRouteCoordinates(decodedRoute);
          return;
        }
      }

      setRouteCoordinates([]);
    } catch (error) {
      console.log('Erro ao buscar rota:', error);
      setRouteCoordinates([]);
    }
  }

  // Busca locais reais conforme o usuário digita
  async function searchLocations(query) {
    if (!query.trim() || !currentLocation) {
      setSearchResults([]);
      return;
    }

    try {
      setLoadingSearch(true);
      const results = await Location.geocodeAsync(query);
      
      if (!results || results.length === 0) {
        setSearchResults([]);
        return;
      }

      // Converte resultados e calcula distâncias
      const placesWithDistance = await Promise.all(
        results.slice(0, 8).map(async (result) => {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            result.latitude,
            result.longitude
          );

          let addressResult = {
            ...result,
            latitude: result.latitude,
            longitude: result.longitude,
          };

          if (!result.street || !result.city) {
            try {
              const [reverseResult] = await Location.reverseGeocodeAsync({
                latitude: result.latitude,
                longitude: result.longitude,
              });
              if (reverseResult) {
                addressResult = {
                  ...addressResult,
                  ...reverseResult,
                  latitude: result.latitude,
                  longitude: result.longitude,
                };
              }
            } catch (reverseError) {
              console.log('Erro no reverse geocode:', reverseError);
            }
          }

          // Constrói o título com rua + número sempre que possível
          const titleParts = [];
          if (addressResult.street) {
            let streetTitle = addressResult.street;
            if (addressResult.streetNumber) {
              streetTitle += `, ${addressResult.streetNumber}`;
            }
            titleParts.push(streetTitle);
          } else if (addressResult.name) {
            titleParts.push(addressResult.name);
          }

          const title = titleParts.length ? titleParts[0] :
            addressResult.city ? `${addressResult.city}${addressResult.region ? `, ${addressResult.region}` : ''}` :
            `${result.latitude.toFixed(5)}, ${result.longitude.toFixed(5)}`;

          // Constrói o subtítulo com bairro + cidade/região
          const subtitleParts = [];
          if (addressResult.subregion) {
            subtitleParts.push(addressResult.subregion);
          }
          if (addressResult.neighborhood && !subtitleParts.includes(addressResult.neighborhood)) {
            subtitleParts.push(addressResult.neighborhood);
          }
          if (addressResult.city && !subtitleParts.includes(addressResult.city)) {
            subtitleParts.push(addressResult.city);
          }
          if (addressResult.region && !subtitleParts.includes(addressResult.region)) {
            subtitleParts.push(addressResult.region);
          }
          if (addressResult.postalCode) {
            subtitleParts.push(addressResult.postalCode);
          }

          const subtitle = subtitleParts.join(', ') || 'Localização';

          return {
            title: title || 'Local encontrado',
            subtitle,
            latitude: result.latitude,
            longitude: result.longitude,
            distance: distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`,
            distanceValue: distance,
          };
        })
      );

      // Ordena por distância (mais próximos primeiro)
      placesWithDistance.sort((a, b) => a.distanceValue - b.distanceValue);
      setSearchResults(placesWithDistance);
    } catch (error) {
      console.log('Erro ao buscar locais:', error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }

  // Debounce para busca
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (activeField) {
      const query = activeField === 'origin' ? originText : destinationText;
      searchTimeoutRef.current = setTimeout(() => {
        searchLocations(query);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [originText, destinationText, activeField, currentLocation]);

  // Recent places will be fetched from backend (user's search history).
  const [recentPlaces, setRecentPlaces] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      setLoadingHistory(true);
      try {
        // TODO: substituir pela URL real do seu backend quando disponível
        const res = await fetch('https://your-backend.example.com/api/recent-places');
        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          // Espera um array de objetos { title, subtitle, distance }
          setRecentPlaces(Array.isArray(data) ? data : []);
        } else {
          setRecentPlaces([]);
        }
      } catch (e) {
        console.log('Erro ao carregar histórico:', e);
        setRecentPlaces([]);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    }

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayPlaces = activeField && (activeField === 'origin' ? originText : destinationText).trim() ? searchResults : recentPlaces;
  const controlledSheetIndex = activeField ? snapPoints.length - 1 : sheetIndex;

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : {
                latitude: -22.8176,
                longitude: -47.0696,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
        }
        showsUserLocation={locationGranted}
        loadingEnabled={true}
        customMapStyle={darkMapStyle}
      >
        {currentLocation ? (
          <Marker
            coordinate={currentLocation}
            title="Você está aqui"
            description="Posição atual"
            pinColor="#34D399"
          />
        ) : (
          <Marker
            coordinate={{
              latitude: -22.8176,
              longitude: -47.0696,
            }}
          />
        )}
        {currentLocation && destinationLocation ? (
          <>
            <Marker
              coordinate={destinationLocation}
              title="Destino"
              pinColor="#3B82F6"
            />
            <Polyline
              coordinates={routeCoordinates.length ? routeCoordinates : [currentLocation, destinationLocation]}
              strokeColor="#3B82F6"
              strokeWidth={4}
              lineDashPattern={[10, 8]}
            />
          </>
        ) : null}
      </MapView>

      <TouchableOpacity
        style={[
          styles.centerButton,
          { bottom: snapPoints[0] + 16 + insets.bottom },
        ]}
        onPress={handleCenterOnUser}
        disabled={!currentLocation}
      >
        <Icon name="crosshair" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* GRADIENT ESCURO */}
      <View style={styles.overlay} />

      {/* BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={controlledSheetIndex}
        onChange={(index) => {
          if (!activeField) {
            setSheetIndex(index);
          }
        }}
        enablePanDownToClose={false}
        enableOverDrag={false}
        nestedScrollEnabled={true}
        enableHandlePanningGesture={!activeField}
        keyboardBehavior="extend"
        keyboardBlurBehavior="none"
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: 24,
          }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <>
            {/* HEADER */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Icon
                  name="arrow-left"
                  size={26}
                  color="#FFF"
                />
              </TouchableOpacity>

              <Text style={styles.title}>
                Planeje sua próxima viagem
              </Text>
            </View>



            {/* INPUTS */}
            <View style={styles.routeCard}>
              <View style={styles.routeLeft}>
                <View style={styles.circle} />

                <View style={styles.verticalLine} />

                <View style={styles.square} />
              </View>

              <View style={styles.inputsContainer}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    ref={originInputRef}
                    placeholder="Insira o local de partida"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={originText}
                    onChangeText={setOriginText}
                    onFocus={handleOriginFocus}
                  />
                  {originText ? (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setOriginText('')}
                    >
                      <Icon name="x" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    ref={destinationInputRef}
                    placeholder="Para onde?"
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    value={destinationText}
                    onChangeText={setDestinationText}
                    onFocus={handleDestinationFocus}
                  />
                  {destinationText ? (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setDestinationText('')}
                    >
                      <Icon name="x" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !(originText && destinationText) && styles.confirmButtonDisabled,
              ]}
              disabled={!(originText && destinationText)}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>

            {/* RECENTES */}
            <View style={styles.listContainer}>
              {activeField && (activeField === 'origin' ? originText : destinationText).trim() ? (
                loadingSearch ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Buscando endereços...</Text>
                  </View>
                ) : searchResults.length === 0 ? (
                  <Text style={styles.noResultsText}>Nenhum endereço encontrado</Text>
                ) : null
              ) : (
                // Quando não está buscando e não há campo ativo, mostrar estado do histórico
                loadingHistory ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Carregando histórico...</Text>
                  </View>
                ) : recentPlaces.length === 0 ? (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <Icon name="clock" size={28} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyText}>Sem histórico de endereços</Text>
                  </View>
                ) : null
              )}

              <View style={styles.historySection}>
                <FlatList
                  data={displayPlaces}
                  keyExtractor={(item, index) => String(index)}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  contentContainerStyle={{ paddingBottom: 12 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.placeItem}
                      onPress={() => handleSelectPlace(item)}
                    >
                      <View style={styles.placeLeft}>
                        <View style={styles.historyIcon}>
                          <Icon
                            name={activeField ? 'search' : 'rotate-ccw'}
                            size={18}
                            color="#D1D5DB"
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.placeTitle}>
                            {item.title}
                          </Text>

                          <Text style={styles.placeSubtitle}>
                            {item.subtitle}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.distance}>
                        {item.distance}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.historyList}
                />
              </View>
            </View>
          </>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#0B0F19' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0B0F19' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5F6368' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1A1F2B' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#05070B' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.18)',
    pointerEvents: 'none',
  },

  sheetBackground: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },

  handle: {
    backgroundColor: '#5A5A5A',
    width: 46,
    height: 4,
    borderRadius: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 6,
  },

  backButton: {
    marginRight: 16,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },

  

  routeCard: {
    marginTop: 18,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
  },

  routeLeft: {
    alignItems: 'center',
    marginRight: 10,
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  verticalLine: {
    width: 2,
    height: 48,
    backgroundColor: '#5A5A5A',
    marginVertical: 6,
  },

  square: {
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
  },

  inputsContainer: {
    flex: 1,
    gap: 10,
  },

  inputWrapper: {
    position: 'relative',
    width: '100%',
  },

  input: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    paddingRight: 44,
    color: '#FFFFFF',
    fontSize: 14,
  },

  clearButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2B2B2B',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  listContainer: {
    marginTop: 18,
    paddingHorizontal: 18,
  },

  placeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },

  placeLeft: {
    flexDirection: 'row',
    flex: 1,
  },

  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  placeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  placeSubtitle: {
    color: '#8B8B8B',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 20,
  },

  distance: {
    color: '#8B8B8B',
    fontSize: 14,
    marginLeft: 10,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    marginTop: 48,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 18,
    fontWeight: '600',
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },

  loadingText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 14,
  },

  noResultsText: {
    color: '#9CA3AF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 14,
  },

  historySection: {
    maxHeight: height * 0.55,
    overflow: 'hidden',
  },

  historyList: {
    maxHeight: height * 0.62,
  },


  minimizedContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  minimizedTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  minimizedSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 12,
  },

  minimizedRouteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161618',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  minimizedRouteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  minimizedRouteText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  destinationSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161618',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  destinationSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  destinationBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    marginRight: 10,
  },

  destinationSummaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  confirmButton: {
    backgroundColor: '#22C55E',
    borderRadius: 14,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 12,
  },

  confirmButtonDisabled: {
    backgroundColor: '#6B7280',
  },

  confirmButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },

  centerButton: {
    position: 'absolute',
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(17, 17, 17, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2F3138',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
});