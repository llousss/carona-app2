import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [password, setPassword] = useState('');

  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔒 Validações simples
  const isNameValid = name.length >= 3;
  const isEmailValid = email.includes('@');
  const isCommunityIdValid = communityId.length > 2;
  const isPasswordValid = password.length >= 8;

  const isFormValid =
    isNameValid && isEmailValid && isCommunityIdValid && isPasswordValid;

  const handleRegister = () => {
    setError('');

    if (!isFormValid) {
      return setError('Please fill all fields correctly');
    }

    setLoading(true);

    // 🔥 Simulação de cadastro
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER E LOGO */}
        <View style={styles.topHeader}>
          <View style={styles.logoContainer}>
            <Icon name="truck" size={20} color="#22C55E" />
            <Text style={styles.logoText}>VamoJunto</Text>
          </View>
          <TouchableOpacity>
            <Icon name="help-circle" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            Junte-se à comunidade para viagens seguras, protegidas e baratas.
          </Text>
        </View>

        {/* CARD FORMULÁRIO */}
        <View style={styles.card}>
          <View style={styles.form}>
            {/* FULL NAME */}
            <Text style={styles.label}>Nome Completo</Text>
            <View
              style={[
                styles.inputContainer,
                focused === 'name' && styles.inputFocused,
              ]}
            >
              <Icon name="user" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Digite seu nome completo"
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                style={styles.input}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
              />
            </View>

            {/* EMAIL */}
            <Text style={styles.label}>Email Institucional</Text>
            <View
              style={[
                styles.inputContainer,
                focused === 'email' && styles.inputFocused,
              ]}
            >
              <Icon name="mail" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="email@instituicao.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>

            {/* COMMUNITY ID */}
            <View style={styles.rowLabel}>
              <Text style={styles.label}>ID da Comunidade</Text>
              <Text style={styles.requiredLabel}>Verificação obrigatória</Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                focused === 'community' && styles.inputFocused,
              ]}
            >
              <Icon name="shield" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Enter verification code"
                placeholderTextColor="#6B7280"
                value={communityId}
                onChangeText={(text) => {
                  setCommunityId(text);
                  setError('');
                }}
                style={styles.input}
                onFocus={() => setFocused('community')}
                onBlur={() => setFocused(null)}
              />
            </View>

            {/* PASSWORD */}
            <Text style={styles.label}>Senha</Text>
            <View
              style={[
                styles.inputContainer,
                focused === 'password' && styles.inputFocused,
              ]}
            >
              <Icon name="lock" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Min. 8 characters"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!showPassword}
                style={styles.input}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
            </View>

            {/* ERRO */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* BOTÃO */}
            <TouchableOpacity
              style={[
                styles.button,
                !isFormValid && { opacity: 0.5 },
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Completar Cadastro</Text>
                  <Icon name="arrow-right" size={20} color="#000" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            {/* ALREADY HAVE ACCOUNT */}
            <Text style={styles.footer}>
              Já tem uma conta?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Login')}
              >
                Faça Login
              </Text>
            </Text>
          </View>
        </View>

        {/* BOTTOM BANNER */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIcon}>
            <Icon name="shield" size={18} color="#22C55E" />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Viagens seguras e protegidas</Text>
            <Text style={styles.bannerSubtitle}>Perfis verificados e monitoramento em tempo real</Text>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#22C55E',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#161618',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  form: {
    width: '100%',
  },
  rowLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  requiredLabel: {
    color: '#EAB308', // Yellow
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  inputFocused: {
    borderColor: '#22C55E',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  error: {
    color: '#EF4444',
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    marginTop: 32,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
  },
  link: {
    color: '#22C55E',
    fontWeight: '700',
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161618',
    borderRadius: 16,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#1f2937', // border mais sutil
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
  },
});