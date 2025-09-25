import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import SpendCard from './SpendCard';
import { Transaction } from '../../services/userService';

interface SpendFrequencyProps {
  transactions?: Transaction[];
  currency?: string;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function firstDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function lastDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function sumInRange(txs: Transaction[], from: Date, to: Date) {
  let amount = 0;
  let count = 0;
  for (const tx of txs) {
    if (tx.type !== 'expense') continue;
    const dt = new Date(tx.date);
    if (dt >= from && dt <= to) {
      amount += Number(tx.amount) || 0;
      count += 1;
    }
  }
  return { amount, count };
}
function pctChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
function formatGrowth(p: number, suffix: string) {
  const sign = p > 0 ? '+' : p < 0 ? '' : '';
  return `${sign}${p.toFixed(0)}% ${suffix}`;
}

export default function SpendFrequency({ transactions = [], currency = 'LKR' }: SpendFrequencyProps) {
  const { today, week, month } = useMemo(() => {
    const now = new Date();

    const todayRange = { from: startOfDay(now), to: endOfDay(now) };
    const yesterdayRange = {
      from: startOfDay(addDays(now, -1)),
      to: endOfDay(addDays(now, -1)),
    };
    const todaySum = sumInRange(transactions, todayRange.from, todayRange.to);
    const yesterdaySum = sumInRange(transactions, yesterdayRange.from, yesterdayRange.to);
    const todayGrowth = pctChange(todaySum.amount, yesterdaySum.amount);

    // This week (last 7 days including today) vs previous 7 days
    const thisWeekFrom = startOfDay(addDays(now, -6));
    const thisWeekTo = endOfDay(now);
    const prevWeekFrom = startOfDay(addDays(now, -13));
    const prevWeekTo = endOfDay(addDays(now, -7));
    const weekSum = sumInRange(transactions, thisWeekFrom, thisWeekTo);
    const prevWeekSum = sumInRange(transactions, prevWeekFrom, prevWeekTo);
    const weekGrowth = pctChange(weekSum.amount, prevWeekSum.amount);

    // This month vs previous month
    const thisMonthFrom = firstDayOfMonth(now);
    const thisMonthTo = endOfDay(now);
    const prevMonthLastDay = new Date(thisMonthFrom.getFullYear(), thisMonthFrom.getMonth(), 0);
    const prevMonthFrom = firstDayOfMonth(prevMonthLastDay);
    const prevMonthTo = lastDayOfMonth(prevMonthLastDay);
    const monthSum = sumInRange(transactions, thisMonthFrom, thisMonthTo);
    const prevMonthSum = sumInRange(transactions, prevMonthFrom, prevMonthTo);
    const monthGrowth = pctChange(monthSum.amount, prevMonthSum.amount);

    return {
      today: {
        amount: todaySum.amount,
        count: todaySum.count,
        growthText: formatGrowth(todayGrowth, 'from yesterday'),
      },
      week: {
        amount: weekSum.amount,
        count: weekSum.count,
        growthText: formatGrowth(weekGrowth, 'vs last 7 days'),
      },
      month: {
        amount: monthSum.amount,
        count: monthSum.count,
        growthText: formatGrowth(monthGrowth, 'vs last month'),
      },
    };
  }, [transactions]);

  return (
    <View style={styles.container}>
      <SpendCard
        headline="Today"
        label="Expenses"
        amount={today.amount}
        currency={currency}
        transactions={today.count}
        growthText={today.growthText}
      />
      <SpendCard
        headline="This Week"
        label="Expenses"
        amount={week.amount}
        currency={currency}
        transactions={week.count}
        growthText={week.growthText}
      />
      <SpendCard
        headline="This Month"
        label="Expenses"
        amount={month.amount}
        currency={currency}
        transactions={month.count}
        growthText={month.growthText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
});