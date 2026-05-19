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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔒 Conta única permitida
  const VALID_EMAIL = 'teste@teste';
  const VALID_PASSWORD = '123456';

  // ✅ Validações
  const isEmailValid = email.includes('@') && email.length > 5;
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = () => {
    setError('');

    if (!isEmailValid) {
      return setError('Digite um email válido');
    }

    if (!isPasswordValid) {
      return setError('Senha deve ter no mínimo 6 caracteres');
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        navigation.navigate('UserTypeSelection');
      } else {
        setError('Email ou senha inválidos');
      }
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {/* LOGO E HEADER */}
        <View style={styles.logoContainer}>
          <Icon name="truck" size={24} color="#22C55E" />
          <Text style={styles.logoText}>VamoJunto</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Faça login para continuar sua jornada</Text>
        </View>

        {/* CARD FORMULÁRIO */}
        <View style={styles.card}>
          <View style={styles.form}>
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
                placeholderTextColor="#9CA3AF"
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

            {/* SENHA */}
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Senha</Text>
              <TouchableOpacity>
                <Text style={styles.forgot}>Esqueci minha senha?</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputContainer,
                focused === 'password' && styles.inputFocused,
              ]}
            >
              <Icon name="lock" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
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

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "eye-off" : "eye"} size={18} color="#9CA3AF" style={styles.eye} />
              </TouchableOpacity>
            </View>

            {/* ERRO */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* BOTÃO LOGIN */}
            <TouchableOpacity
              style={[
                styles.button,
                !isFormValid && { opacity: 0.5 },
              ]}
              onPress={handleLogin}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* OR CONTINUE WITH */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Ou continue com</Text>
              <View style={styles.divider} />
            </View>

            {/* SOCIAL BUTTONS */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Icon name="apple" size={18} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Não tem uma conta?{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Register')}
            >
              Criar Conta
            </Text>
          </Text>

          <View style={styles.policyContainer}>
            <Text style={styles.policyText}>Privacy Policy</Text>
            <Text style={styles.policyDot}>•</Text>
            <Text style={styles.policyText}>Terms of Service</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111', // Fundo escuro como no painel do passageiro
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoText: {
    color: '#22C55E',
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 8,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
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
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 4,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  forgot: {
    color: '#22C55E',
    fontSize: 13,
    fontWeight: '500',
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
  eye: {
    marginLeft: 10,
  },
  error: {
    color: '#EF4444',
    marginTop: 12,
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#22C55E', // Botão verde
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#000000', // Texto preto para constrastar com verde (estilo uber/moderno)
    fontWeight: '700',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#2B2B2B',
  },
  dividerText: {
    color: '#9CA3AF',
    marginHorizontal: 16,
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D1D1D',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  socialIcon: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 6,
  },
  socialText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 24,
  },
  link: {
    color: '#22C55E',
    fontWeight: '700',
  },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  policyText: {
    color: '#6B7280',
    fontSize: 12,
  },
  policyDot: {
    color: '#6B7280',
    marginHorizontal: 12,
    fontSize: 12,
  },
});