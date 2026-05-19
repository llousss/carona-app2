import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Switch,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

// ESTILO DO MAPA MODO ESCURO
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0B0F19' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0F19' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5F6368' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1A1F2B' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#05070B' }] },
];

export default function DriverHome({ navigation }) {
  const mapRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const insets = useSafeAreaInsets();
  
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [activeField, setActiveField] = useState(null);
  
  const [locationGranted, setLocationGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  
  const [buscarPassageiros, setBuscarPassageiros] = useState(false);
  const [isAgendado, setIsAgendado] = useState(false);
  const [date, setDate] = useState(new Date());
  
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Estados de Busca
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Snap points pro BottomSheet
  const snapPoints = useMemo(() => [height * 0.40, height - insets.top], [insets.top]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      setLocationGranted(true);
      const loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation(loc.coords);
    })();
  }, []);

  // Effect para buscar locais quando digita (Debounce)
  useEffect(() => {
    if (activeField === 'origem' && origem.length > 2) {
      searchLocations(origem);
    } else if (activeField === 'destino' && destino.length > 2) {
      searchLocations(destino);
    } else {
      setSearchResults([]);
    }
  }, [origem, destino, activeField]);

  // Auto-desenhar rota quando ambos origem e destino forem selecionados
  useEffect(() => {
    if (originLocation && destinationLocation && mapRef.current) {
      setRouteCoordinates([originLocation, destinationLocation]);
      mapRef.current.fitToCoordinates([originLocation, destinationLocation], {
        edgePadding: { top: 80, right: 60, bottom: 350, left: 60 },
        animated: true,
      });
    }
  }, [originLocation, destinationLocation]);

  const searchLocations = async (query) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    setLoadingSearch(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await Location.geocodeAsync(query);
        if (results.length > 0) {
          const detailedResults = await Promise.all(
            results.slice(0, 5).map(async (res) => {
              const details = await Location.reverseGeocodeAsync({
                latitude: res.latitude,
                longitude: res.longitude,
              });
              if (details.length > 0) {
                return {
                  ...res,
                  name: details[0].street || details[0].name || query,
                  city: details[0].city || details[0].subregion,
                  district: details[0].district,
                };
              }
              return { ...res, name: query };
            })
          );
          setSearchResults(detailedResults);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingSearch(false);
      }
    }, 500);
  };

  const handleSelectPlace = (place) => {
    const text = `${place.name}${place.district ? `, ${place.district}` : ''}`;
    if (activeField === 'origem') {
      setOrigem(text);
      setOriginLocation({ latitude: place.latitude, longitude: place.longitude });
    } else if (activeField === 'destino') {
      setDestino(text);
      setDestinationLocation({ latitude: place.latitude, longitude: place.longitude });
    }
    setSearchResults([]);
    setActiveField(null);
  };

  const handleCenterOnUser = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 500);
    }
  };

  const handleTracarRota = () => {
    if (!originLocation || !destinationLocation) {
        // Se ainda não escolheu os pontos reais, e apenas clicou no botão:
        if (!origem || !destino) return;
        
        // Mock fallback se não usou o autocomplete
        if (currentLocation) {
          const mockDest = {
            latitude: currentLocation.latitude + 0.02,
            longitude: currentLocation.longitude + 0.02,
          };
          setOriginLocation(currentLocation);
          setDestinationLocation(mockDest);
        }
    }

    if (buscarPassageiros) {
      setIsSearching(true);
      bottomSheetRef.current?.snapToIndex(0);
      
      // Simula um match de passageiro após 5 segundos
      setTimeout(() => {
        setIsSearching(false);
        setBuscarPassageiros(false);
        Alert.alert(
          "Passageiro Encontrado!",
          "Ana - Vai do Ponto A ao Ponto B.\nDesvio na sua rota: 2 min.\n\nAceitar Carona?",
          [
            { text: "Recusar", style: "cancel" },
            { text: "Aceitar", onPress: () => console.log("Carona aceita") }
          ]
        );
      }, 5000);
    } else {
       bottomSheetRef.current?.snapToIndex(0);
    }
  };

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={
          currentLocation ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          } : {
            latitude: -23.550520,
            longitude: -46.633308,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
        showsUserLocation={locationGranted}
        loadingEnabled={true}
        customMapStyle={darkMapStyle}
      >
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#22C55E"
            strokeWidth={4}
            lineDashPattern={[10, 8]}
          />
        )}
        {routeCoordinates.length > 0 && originLocation && (
          <Marker coordinate={originLocation} pinColor="#FFFFFF" title="Origem" />
        )}
        {routeCoordinates.length > 0 && destinationLocation && (
          <Marker coordinate={destinationLocation} pinColor="#22C55E" title="Destino" />
        )}
      </MapView>

      {/* BOTÃO VOLTAR */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-left" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* BOTÃO CENTRALIZAR */}
      <TouchableOpacity
        style={[styles.centerButton, { bottom: snapPoints[0] + 16 }]}
        onPress={handleCenterOnUser}
      >
        <Icon name="crosshair" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* BUSCANDO PASSAGEIROS INDICATOR */}
      {isSearching && (
        <View style={[styles.searchingBadge, { top: insets.top + 20 }]}>
          <ActivityIndicator size="small" color="#22C55E" />
          <Text style={styles.searchingText}>Buscando passageiros na rota...</Text>
        </View>
      )}

      {/* GRADIENTE/OVERLAY ESCURO */}
      <View style={styles.overlay} />

      {/* BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        keyboardBehavior="extend"
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent} keyboardShouldPersistTaps="handled">
          
          <Text style={styles.title}>Sua Rota</Text>
          
          {/* INPUTS ESTILO UBER (Timeline) */}
          <View style={styles.routeCard}>
            <View style={styles.routeLeft}>
              <View style={styles.circle} />
              <View style={styles.verticalLine} />
              <View style={styles.square} />
            </View>

            <View style={styles.inputsContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Local de partida (Ex: Minha casa)"
                  placeholderTextColor="#9CA3AF"
                  value={origem}
                  onChangeText={setOrigem}
                  onFocus={() => {
                     setActiveField('origem');
                     bottomSheetRef.current?.snapToIndex(1);
                  }}
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Destino (Ex: Trabalho)"
                  placeholderTextColor="#9CA3AF"
                  value={destino}
                  onChangeText={setDestino}
                  onFocus={() => {
                     setActiveField('destino');
                     bottomSheetRef.current?.snapToIndex(1);
                  }}
                />
              </View>
            </View>
          </View>

          {/* ÁREA DINÂMICA: RESULTADOS DE BUSCA OU OPÇÕES */}
          {activeField && (origem.length > 2 || destino.length > 2) ? (
            <View style={styles.listContainer}>
              {loadingSearch ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#22C55E" />
                  <Text style={styles.loadingText}>Buscando locais...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.placeItem}
                    onPress={() => handleSelectPlace(item)}
                  >
                    <View style={styles.placeLeft}>
                      <View style={styles.historyIcon}>
                        <Icon name="map-pin" size={18} color="#FFF" />
                      </View>
                      <View>
                        <Text style={styles.placeTitle}>{item.name}</Text>
                        <Text style={styles.placeSubtitle}>
                          {item.district ? `${item.district}, ` : ''}{item.city}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noResultsText}>Nenhum local encontrado.</Text>
              )}
            </View>
          ) : (
            <>
              {/* CONTROLES DE BUSCA E AGENDAMENTO */}
              <View style={styles.optionsContainer}>
                
                {/* LIGAR MODO BUSCA */}
                <View style={[styles.optionRow, { borderBottomWidth: 1, borderBottomColor: '#2B2B2B' }]}>
                  <View>
                    <Text style={styles.optionTitle}>Buscar Passageiros</Text>
                    <Text style={styles.optionSubtitle}>Encontre rotas e fature</Text>
                  </View>
                  <Switch
                    value={buscarPassageiros}
                    onValueChange={setBuscarPassageiros}
                    trackColor={{ false: '#3f3f46', true: '#22C55E' }}
                    thumbColor={buscarPassageiros ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>

                {/* QUANDO SAIR */}
                <View style={[styles.optionRow, { paddingTop: 16 }]}>
                  <View>
                    <Text style={styles.optionTitle}>Partida</Text>
                    <Text style={styles.optionSubtitle}>
                      {isAgendado 
                        ? `${date.toLocaleDateString()} às ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                        : 'Sair agora'}
                    </Text>
                  </View>
                  
                  <View style={styles.scheduleButtons}>
                    <TouchableOpacity 
                      style={[styles.smallBtn, !isAgendado && styles.smallBtnActive]}
                      onPress={() => setIsAgendado(false)}
                    >
                      <Text style={[styles.smallBtnText, !isAgendado && styles.smallBtnTextActive]}>Agora</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.smallBtn, isAgendado && styles.smallBtnActive]}
                      onPress={() => {
                        // Mock de agendamento (define pra amanhã às 08:00)
                        const mockDate = new Date();
                        mockDate.setDate(mockDate.getDate() + 1);
                        mockDate.setHours(8, 0, 0);
                        setDate(mockDate);
                        setIsAgendado(true);
                        Alert.alert("Agendamento Simulado", "Viagem agendada para amanhã às 08:00.");
                      }}
                    >
                      <Text style={[styles.smallBtnText, isAgendado && styles.smallBtnTextActive]}>Agendar</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>

              {/* BOTÃO CONFIRMAR */}
              <TouchableOpacity 
                style={[styles.confirmButton, (!origem || !destino) && styles.confirmButtonDisabled]}
                onPress={handleTracarRota}
                disabled={!origem || !destino}
              >
                <Text style={styles.confirmButtonText}>
                  {isAgendado ? 'Agendar Rota' : 'Traçar Rota e Ir'}
                </Text>
              </TouchableOpacity>
            </>
          )}

        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0F' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    pointerEvents: 'none',
  },
  backButton: {
    position: 'absolute',
    left: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1F1F25',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2F3138',
    elevation: 6,
    zIndex: 10,
  },
  centerButton: {
    position: 'absolute',
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1F1F25',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2F3138',
    elevation: 6,
    zIndex: 10,
  },
  searchingBadge: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F25',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#22C55E',
    elevation: 5,
    zIndex: 10,
  },
  searchingText: {
    color: '#FFF',
    marginLeft: 10,
    fontWeight: '600',
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
  sheetContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 18,
  },
  routeCard: {
    borderWidth: 1,
    borderColor: '#2B2B2B',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    backgroundColor: '#111111',
    marginBottom: 24,
  },
  routeLeft: {
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'center',
  },
  circle: { width: 14, height: 14, borderRadius: 10, backgroundColor: '#FFFFFF' },
  verticalLine: { width: 2, height: 48, backgroundColor: '#5A5A5A', marginVertical: 6 },
  square: { width: 14, height: 14, backgroundColor: '#FFFFFF' },
  inputsContainer: { flex: 1, gap: 10 },
  inputWrapper: { width: '100%' },
  input: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 14,
  },
  listContainer: {
    paddingTop: 10,
  },
  placeItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  placeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginTop: 4,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 14,
  },
  noResultsText: {
    color: '#9CA3AF',
    paddingVertical: 12,
    fontSize: 14,
  },
  optionsContainer: {
    backgroundColor: '#161618',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  optionTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  optionSubtitle: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
  scheduleButtons: { flexDirection: 'row', gap: 8 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1F1F25',
  },
  smallBtnActive: { backgroundColor: '#22C55E' },
  smallBtnText: { color: '#9CA3AF', fontSize: 13, fontWeight: '600' },
  smallBtnTextActive: { color: '#000000' },
  confirmButton: {
    backgroundColor: '#22C55E',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: { backgroundColor: '#166534', opacity: 0.5 },
  confirmButtonText: { color: '#000000', fontSize: 16, fontWeight: '700' },
});