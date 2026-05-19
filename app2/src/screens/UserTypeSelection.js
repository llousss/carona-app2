import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function UserTypeSelection({ navigation }) {

  const selectDriver = () => {
    navigation.navigate('DriverHome');
  };

  const selectPassenger = () => {
    navigation.navigate('PassengerHome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=11' }}
              style={styles.avatarImage}
            />
          </View>
          <Text style={styles.headerLogo}>VamoJunto</Text>
          <TouchableOpacity>
            <Icon name="users" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* TITLE */}
          <Text style={styles.title}>Bem-vindo ao{'\n'}VamoJunto</Text>
          <Text style={styles.subtitle}>
            Como você deseja se locomover hoje em sua comunidade?
          </Text>

          {/* MOTORISTA CARD */}
          <TouchableOpacity style={styles.card} onPress={selectDriver} activeOpacity={0.9}>
            {/* Watermark simulada usando icon grande com opacidade */}
            <Icon name="target" size={120} color="rgba(255,255,255,0.02)" style={styles.watermark} />

            <View style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
              <Icon name="navigation" size={24} color="#22C55E" />
            </View>
            <Text style={[styles.cardTitle, { color: '#22C55E' }]}>Motorista</Text>
            <Text style={styles.cardDesc}>
              Ofereça caronas, ajude seus vizinhos e economize nos custos de viagem compartilhando seu trajeto.
            </Text>
            <View style={styles.cardAction}>
              <Text style={[styles.cardActionText, { color: '#22C55E' }]}>Começar a dirigir</Text>
              <Icon name="arrow-right" size={16} color="#22C55E" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>

          {/* PASSAGEIRO CARD */}
          <TouchableOpacity style={styles.card} onPress={selectPassenger} activeOpacity={0.9}>
            <Icon name="user" size={120} color="rgba(255,255,255,0.02)" style={styles.watermark} />

            <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Icon name="user" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.cardTitle, { color: '#3B82F6' }]}>Passageiro</Text>
            <Text style={styles.cardDesc}>
              Encontre rotas seguras, viaje com pessoas conhecidas e chegue ao seu destino de forma eficiente.
            </Text>
            <View style={styles.cardAction}>
              <Text style={[styles.cardActionText, { color: '#3B82F6' }]}>Encontrar carona</Text>
              <Icon name="arrow-right" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>

          {/* INFO BANNER */}
          <View style={styles.infoBanner}>
            <Icon name="info" size={16} color="#22C55E" style={{ marginTop: 2 }} />
            <Text style={styles.infoText}>
              Você pode trocar de papéis a qualquer momento no seu perfil. Sua escolha atual apenas define sua visualização inicial.
            </Text>
          </View>

        </ScrollView>
      </View>

      {/* BOTTOM TAB SIMULATION */}
      <View style={styles.bottomTab}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="home" size={20} color="#9CA3AF" />
          <Text style={styles.tabText}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="message-square" size={20} color="#9CA3AF" />
          <Text style={styles.tabText}>CHAT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="map" size={20} color="#9CA3AF" />
          <Text style={styles.tabText}>MINHAS CARONAS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="user" size={20} color="#22C55E" />
          <Text style={[styles.tabText, { color: '#22C55E' }]}>PERFIL</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111111',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#2B2B2B',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  headerLogo: {
    color: '#22C55E',
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100, // espaço para tab
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#161618',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    position: 'relative',
    overflow: 'hidden',
  },
  watermark: {
    position: 'absolute',
    right: -20,
    top: 20,
    transform: [{ rotate: '-15deg' }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.1)',
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 12,
    flex: 1,
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: '#2B2B2B',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
  },
});