import colors from '@/constants/color';
import { Fonts } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

export default function BudgetScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerBox}>
        <Text style={styles.header}>See you in next update</Text>
        <Text style={styles.sub}>Budget features are coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});