import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomTab from '../components/BottomTab';

import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

export default function PassengerHome({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Pedro!</Text>

          <TouchableOpacity
            style={styles.searchBox}
            onPress={() => navigation.navigate('DestinationSearch')}
          >
            <Icon name="search" size={18} color="#32D583" />

            <Text style={styles.searchText}>
              Para onde você quer ir?
            </Text>
          </TouchableOpacity>
        </View>

        {/* DESTINOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Destinos frequentes
          </Text>

          <DestinationCard
            icon="home"
            color="#22C55E"
            title="Casa"
            subtitle="Rua das Flores, 123"
          />

          <DestinationCard
            icon="briefcase"
            color="#3B82F6"
            title="Empresa"
            subtitle="Tech Plaza, Bloco B"
          />

          <DestinationCard
            icon="book-open"
            color="#EAB308"
            title="Universidade"
            subtitle="Campus Central - Portão 2"
          />
        </View>

        {/* LOCALIZAÇÃO */}
        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>
              Sua localização
            </Text>

            <TouchableOpacity>
              <Text style={styles.details}>
                Ver detalhes
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.mapCard}>
            <ImageBackground
              source={{
                uri: 'https://i.imgur.com/yY3Z5YB.jpeg',
              }}
              style={styles.mapImage}
              imageStyle={{ borderRadius: 22 }}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.mapOverlay}
              >
                <View style={styles.locationBadge}>
                  <Icon
                    name="navigation"
                    size={12}
                    color="#32D583"
                  />

                  <Text style={styles.locationText}>
                    Av. Paulista, 1500
                  </Text>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* CARDS */}
        <View style={styles.cardsRow}>
          <QuickCard
            icon="calendar"
            title="Agendar"
            subtitle="Próxima corrida"
          />

          <QuickCard
            icon="users"
            title="Comunidades"
            subtitle="3 comunidades"
          />
        </View>
      </ScrollView>

      <BottomTab />
    </View>
  );
}

function DestinationCard({
  icon,
  color,
  title,
  subtitle,
}) {
  return (
    <TouchableOpacity style={styles.destinationCard}>
      <View
        style={[
          styles.destinationIcon,
          { backgroundColor: `${color}20` },
        ]}
      >
        <Icon name={icon} size={18} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.destinationTitle}>
          {title}
        </Text>

        <Text style={styles.destinationSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Icon
        name="chevron-right"
        size={18}
        color="#666"
      />
    </TouchableOpacity>
  );
}

function QuickCard({ icon, title, subtitle }) {
  return (
    <TouchableOpacity style={styles.quickCard}>
      <View style={styles.quickIcon}>
        <Icon name={icon} size={20} color="#32D583" />
      </View>

      <Text style={styles.quickTitle}>
        {title}
      </Text>

      <Text style={styles.quickSubtitle}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  greeting: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 22,
  },

  searchBox: {
     flex: 1,
  backgroundColor: '#202020',
  borderRadius: 18,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 18,
  height: 58,
  borderWidth: 1,
  borderColor: '#2B2B2B',
  },

  searchText: {
    color: '#7A7A7A',
    marginLeft: 12,
    fontSize: 15,
  },

  section: {
    marginTop: 34,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
  },

  destinationCard: {
    backgroundColor: '#202020',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },

  destinationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  destinationTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },

  destinationSubtitle: {
    color: '#7A7A7A',
    fontSize: 13,
    marginTop: 4,
  },

  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  details: {
    color: '#32D583',
    fontSize: 13,
    fontWeight: '600',
  },

  mapCard: {
    height: 200,
    borderRadius: 22,
    overflow: 'hidden',
  },

  mapImage: {
    flex: 1,
  justifyContent: 'flex-end',
  opacity: 0.88,
  },

  mapOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },

  locationBadge: {
    backgroundColor: 'rgba(20,20,20,0.92)',
    alignSelf: 'flex-start',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 6,
  },

  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 14,
  },

  quickCard: {
    flex: 1,
    backgroundColor: '#202020',
    borderRadius: 22,
    padding: 18,
    height: 140,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },

  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(50,213,131,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  quickTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  quickSubtitle: {
    color: '#7A7A7A',
    marginTop: 6,
    fontSize: 13,
  },
});