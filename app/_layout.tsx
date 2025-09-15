import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-reanimated';
import GoogleLoginButton from '../components/GoogleLoginButton';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return (
      <LinearGradient
        colors={colorScheme === 'dark' ? ['#1a1a2e', '#16213e'] : ['#4facfe', '#00f2fe']}
        style={styles.container}
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'light'} />
        
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>$</Text>
          </View>
          <Text style={[styles.appName, { color: colorScheme === 'dark' ? '#fff' : '#fff' }]}>
            SpendWise
          </Text>
          <Text style={[styles.tagline, { color: colorScheme === 'dark' ? '#b8b8b8' : '#e8f4fd' }]}>
            Smart Financial Tracking
          </Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: colorScheme === 'dark' ? '#fff' : '#fff' }]}>
            Welcome Back
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: colorScheme === 'dark' ? '#b8b8b8' : '#e8f4fd' }]}>
            Take control of your finances with ease
          </Text>
        </View>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <GoogleLoginButton onLogin={() => setLoggedIn(true)} />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={[styles.dividerText, { color: colorScheme === 'dark' ? '#b8b8b8' : '#e8f4fd' }]}>
              OR
            </Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.facebookButton} disabled>
            <Text style={styles.facebookButtonText}>
              Continue with Facebook
            </Text>
            <Text style={[styles.comingSoon, { color: colorScheme === 'dark' ? '#b8b8b8' : '#e8f4fd' }]}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colorScheme === 'dark' ? '#b8b8b8' : '#e8f4fd' }]}>
            Secure • Private • Easy to Use
          </Text>
        </View>
      </LinearGradient>
    );
  }

  // Home Page after login
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.9,
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
    width: '80%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  facebookButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    opacity: 0.6,
  },
  facebookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  comingSoon: {
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.8,
  },
  // Home Page Styles
  homeContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  homeLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  homeLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  homeAppName: {
    fontSize: 24,
    fontWeight: '700',
  },
  welcomeHome: {
    alignItems: 'center',
    marginBottom: 40,
  },
  homeWelcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  homeWelcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});