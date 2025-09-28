import React, { useState, useMemo } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Transaction } from '../../services/userService';

interface SpendFrequencyProps {
  transactions?: Transaction[];
}

export default function SpendFrequency({ transactions = [] }: SpendFrequencyProps) {
  const [activeTab, setActiveTab] = useState('Overall');
  const tabs = ['Overall', 'Week', 'Month', 'Year'];

  const chartData = useMemo(() => {
    const now = new Date();
    let filteredTx: Transaction[] = [];

    if (activeTab === 'Week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 6);
      filteredTx = transactions.filter(
        tx => tx.type === 'expense' && new Date(tx.date) >= startOfWeek
      );
    } else if (activeTab === 'Month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredTx = transactions.filter(
        tx => tx.type === 'expense' && new Date(tx.date) >= startOfMonth
      );
    } else if (activeTab === 'Year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filteredTx = transactions.filter(
        tx => tx.type === 'expense' && new Date(tx.date) >= startOfYear
      );
    } else {
      filteredTx = transactions.filter(tx => tx.type === 'expense');
    }

    const labels: string[] = [];
    const data: number[] = [];

    filteredTx.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    filteredTx.forEach(tx => {
      const date = new Date(tx.date);
      let label = '';
      if (activeTab === 'Year' || activeTab === 'Overall') {
        label = `${date.getMonth() + 1}-${date.getFullYear()}`;
      } else {
        label = date.toISOString().slice(5, 10);
      }
      const idx = labels.indexOf(label);
      if (idx >= 0) {
        data[idx] += tx.amount;
      } else {
        labels.push(label);
        data.push(tx.amount);
      }
    });

    return { labels, data };
  }, [transactions, activeTab]);

  return (
    <View style={styles.sectionBox}>
    <BarChart
  data={{
    labels: chartData.labels,
    datasets: [{ data: chartData.data }],
  }}
  width={Dimensions.get('window').width - 40} // or container width
  height={200}
  yAxisLabel=""
  yAxisSuffix="LKR"
  chartConfig={{
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(245,158,66, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#f59e42' },
  }}
  fromZero
  withHorizontalLabels={false} // hide x-axis labels
  xLabelsOffset={0} // remove left offset
  style={{ borderRadius: 16, paddingLeft: 0 }} // remove left padding
/>

      <View style={styles.tabsRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabActiveText]}>
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
    marginBottom: 24,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
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
