import React from 'react';
import { StatusBar, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DebtManage() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top','right','left']}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.content, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Manage Debt</Text>
        <Text style={styles.body}>
          Hello – This is for debt management. Add forms, charts, etc.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  body: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
  },
});