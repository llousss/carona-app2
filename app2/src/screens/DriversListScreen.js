import React, { useMemo, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import MapView, {
  Marker,
} from 'react-native-maps';

import BottomSheet, {
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import Icon from 'react-native-vector-icons/Feather';

const { height } = Dimensions.get('window');

const DRIVERS = [
  {
    id: '1',
    name: 'Ricardo',
    type: 'Match Perfeito',
    vehicle: 'Tesla Model 3',
    rating: '4.98',
    price: 'R$ 9,94',
    matchType: 'perfect',
    image:
      'https://i.pravatar.cc/300?img=12',
  },
  {
    id: '2',
    name: 'Juliana',
    type: 'Pequeno Desvio',
    vehicle: 'Honda Civic',
    rating: '4.85',
    price: 'R$ 12,50',
    matchType: 'detour',
    image:
      'https://i.pravatar.cc/300?img=32',
  },
  {
    id: '3',
    name: 'André',
    type: 'Pequeno Desvio',
    vehicle: 'Carro preto',
    rating: '4.92',
    price: 'GRÁTIS',
    matchType: 'free',
    image:
      'https://i.pravatar.cc/300?img=15',
  },
];

export default function DriversListScreen({
  navigation,
  route,
}) {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(
    () => ['85%'],
    []
  );

  const [selectedDriver, setSelectedDriver] =
    useState(null);

  const currentLocation =
    route.params?.currentLocation;

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude:
            currentLocation?.latitude ||
            -22.8176,
          longitude:
            currentLocation?.longitude ||
            -47.0696,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
          />
        )}
      </MapView>

      {/* ESCURECIMENTO */}
      <View style={styles.overlay} />

      {/* BOTÃO VOLTAR */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon
          name="arrow-left"
          size={26}
          color="#FFF"
        />
      </TouchableOpacity>

      {/* BOTTOM SHEET */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableOverDrag={false}
        backgroundStyle={
          styles.sheetBackground
        }
        handleIndicatorStyle={
          styles.handle
        }
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 120,
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              Motoristas Disponíveis
            </Text>

            <Text style={styles.subtitle}>
              Selecione uma carona para
              continuar
            </Text>
          </View>

          <View style={styles.list}>
            {DRIVERS.map(driver => {
              const selected =
                selectedDriver?.id ===
                driver.id;

              return (
                <TouchableOpacity
                  key={driver.id}
                  style={[
                    styles.driverCard,
                    selected &&
                      styles.driverCardSelected,
                  ]}
                  onPress={() =>
                    setSelectedDriver(
                      driver
                    )
                  }
                >
                  <View
                    style={styles.driverLeft}
                  >
                    <View
                      style={
                        styles.avatarWrapper
                      }
                    >
                      <Image
                        source={{
                          uri: driver.image,
                        }}
                        style={
                          styles.avatar
                        }
                      />

                      <View
                        style={
                          styles.badge
                        }
                      >
                        <Icon
                          name="star"
                          size={12}
                          color="#000"
                        />
                      </View>
                    </View>

                    <View>
                      <Text
                        style={
                          styles.driverName
                        }
                      >
                        {driver.name}
                      </Text>

                      <Text
                        style={[
                          styles.matchText,
                          driver.matchType ===
                            'perfect'
                            ? {
                                color:
                                  '#22C55E',
                              }
                            : {
                                color:
                                  '#FACC15',
                              },
                        ]}
                      >
                        {driver.type}
                      </Text>

                      <Text
                        style={
                          styles.vehicle
                        }
                      >
                        {
                          driver.vehicle
                        }{' '}
                        •{' '}
                        {
                          driver.rating
                        }{' '}
                        ★
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.price,
                      driver.price ===
                      'GRÁTIS'
                        ? {
                            color:
                              '#7CFF7C',
                          }
                        : {},
                    ]}
                  >
                    {driver.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            disabled={!selectedDriver}
            style={[
              styles.detailsButton,
              !selectedDriver &&
                styles.disabledButton,
            ]}
          >
            <Text
              style={
                styles.detailsButtonText
              }
            >
              Ver Detalhes
            </Text>
          </TouchableOpacity>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#050505' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#666' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#222' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      'rgba(0,0,0,0.35)',
  },

  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor:
      'rgba(17,17,17,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },

  sheetBackground: {
    backgroundColor: '#0F0F10',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },

  handle: {
    backgroundColor: '#5A5A5A',
    width: 50,
    height: 5,
    borderRadius: 10,
  },

  header: {
    paddingHorizontal: 22,
    marginTop: 10,
  },

  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },

  subtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    marginTop: 6,
  },

  list: {
    paddingHorizontal: 18,
    marginTop: 24,
  },

  driverCard: {
    backgroundColor: '#161616',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  driverCardSelected: {
    borderColor: '#22C55E',
  },

  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarWrapper: {
    marginRight: 14,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7CFF7C',
    position: 'absolute',
    bottom: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  driverName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  matchText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },

  vehicle: {
    color: '#C4C4C4',
    fontSize: 15,
    marginTop: 4,
  },

  price: {
    color: '#4ADE80',
    fontSize: 18,
    fontWeight: '700',
  },

  detailsButton: {
    backgroundColor: '#22C55E',
    marginHorizontal: 20,
    marginTop: 12,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#2B2B2B',
  },

  detailsButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});