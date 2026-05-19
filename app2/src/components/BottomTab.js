import { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

const tabs = [
  { key: 'home', icon: 'home' },
  { key: 'chat', icon: 'message-circle' },
  { key: 'rides', icon: 'map' },
  { key: 'profile', icon: 'user' },
];

export default function BottomTab() {
  const [active, setActive] = useState('home');

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = active === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActive(tab.key)}
              style={styles.tab}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  color={isActive ? '#22C55E' : '#6B7280'}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 26,
    left: 20,
    right: 20,
  },

  container: {
    position: 'absolute',
  left: 16,
  right: 16,
  bottom: 22,
  height: 78,

  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',

  backgroundColor: '#060A12',

  borderRadius: 28,

  borderWidth: 1,
  borderColor: '#111827',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.35,
  shadowRadius: 20,

  elevation: 12,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeIconContainer: {
    backgroundColor: 'rgba(0,255,153,0.12)',
  },
});