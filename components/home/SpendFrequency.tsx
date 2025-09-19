// components/home/SpendFrequency.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SpendFrequency() {
  const [activeTab, setActiveTab] = useState('Today');
  const tabs = ['Today', 'Week', 'Month', 'Year'];

  return (
    <View style={styles.sectionBox}>
      <Text style={styles.sectionTitle}>Spend Frequency</Text>
      <View style={styles.chartPlaceholder} />
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive
            ]}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabActiveText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionBox: { 
    marginHorizontal: 20, 
    marginBottom: 24 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 12 
  },
  chartPlaceholder: { 
    height: 80, 
    backgroundColor: '#e0e7ff', 
    borderRadius: 16, 
    marginBottom: 10 
  },
  tabsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  tab: {
    paddingHorizontal: 12, 
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabActive: { 
    backgroundColor: '#fef3c7',
  },
  tabText: {
    color: '#888',
    fontWeight: '500',
  },
  tabActiveText: { 
    color: '#f59e42', 
    fontWeight: 'bold',
  },
});