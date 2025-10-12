import { Category } from '@/components/transactions/CategorySelector';
import colors from '@/constants/color';
import { Fonts } from '@/constants/theme';
import { CategoryBudget, CreateBudgetInput, TimeframeType } from '@/services/budgetService';
import { categories as allCategories } from '@/utils/categoryUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddBudgetModal({ visible, onClose, onSubmit, initial, submitLabel }: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: CreateBudgetInput) => void;
  initial?: { name: string; timeframe: TimeframeType; startDate: string; endDate: string; categories: CategoryBudget[] };
  submitLabel?: string;
}) {
  const [name, setName] = useState('My Budget');
  const [timeframe, setTimeframe] = useState<TimeframeType>('monthly');
  const [startDate, setStartDate] = useState<Date>(getPeriodStart(new Date(), 'monthly'));
  const [endDate, setEndDate] = useState<Date>(getPeriodEnd(new Date(), 'monthly'));
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, string>>({});
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const selectedCategories = useMemo<Category[]>(() => allCategories, []);

  // hydrate form when editing
  useEffect(() => {
    if (!visible) return;
    if (!initial) return;
    setName(initial.name || 'My Budget');
    setTimeframe(initial.timeframe || 'custom');
    setStartDate(parseDate(initial.startDate, true));
    setEndDate(parseDate(initial.endDate, false));
    setCategoryBudgets(() => {
      const map: Record<string, string> = {};
      for (const c of initial.categories || []) {
        map[c.category] = String(c.limit ?? '');
      }
      return map;
    });
  }, [visible, initial]);

  function setPeriod(tf: TimeframeType) {
    setTimeframe(tf);
    const s = getPeriodStart(new Date(), tf);
    const e = getPeriodEnd(new Date(), tf);
    setStartDate(s);
    setEndDate(e);
  }

  function handleCreate() {
    const cats: CategoryBudget[] = Object.entries(categoryBudgets)
      .map(([category, limitStr]) => ({ category, limit: Number(limitStr) || 0 }))
      .filter(c => c.limit > 0);

    const payload: CreateBudgetInput = {
      name: name.trim() || 'Budget',
      timeframe,
      startDate: toDateOnly(startDate),
      endDate: toDateOnly(endDate),
      categories: cats,
    };
    onSubmit(payload);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Create Budget</Text>

          <TextInput
            placeholder="Budget name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <View style={styles.row}>
            {(['weekly', 'monthly', 'custom'] as TimeframeType[]).map(tf => (
              <TouchableOpacity key={tf} style={[styles.chip, timeframe === tf && styles.chipActive]} onPress={() => setPeriod(tf)}>
                <Text style={[styles.chipText, timeframe === tf && styles.chipTextActive]}>{capitalize(tf)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.datesRow}>
            <Text style={styles.label}>Start</Text>
            {Platform.OS === 'ios' ? (
              <>
                <DateTimePicker
                  value={startDate}
                  onChange={(_, d) => {
                    if (!d) return;
                    setStartDate(beginOfDay(d));
                    if (endDate < d) setEndDate(endOfDay(d));
                  }}
                  mode="date"
                  display="inline"
                />
                <Text style={styles.datePreview}>{toDateOnly(startDate)}</Text>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.dateButtonText}>{toDateOnly(startDate)}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    onChange={(_, d) => {
                      setShowStartPicker(false);
                      if (!d) return;
                      const b = beginOfDay(d);
                      setStartDate(b);
                      if (endDate < b) setEndDate(endOfDay(b));
                    }}
                    mode="date"
                    display="calendar"
                  />
                )}
              </>
            )}
          </View>
          <View style={styles.datesRow}>
            <Text style={styles.label}>End</Text>
            {Platform.OS === 'ios' ? (
              <>
                <DateTimePicker
                  value={endDate}
                  minimumDate={startDate}
                  onChange={(_, d) => d && setEndDate(endOfDay(d))}
                  mode="date"
                  display="inline"
                />
                <Text style={styles.datePreview}>{toDateOnly(endDate)}</Text>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.dateButtonText}>{toDateOnly(endDate)}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    minimumDate={startDate}
                    onChange={(_, d) => {
                      setShowEndPicker(false);
                      if (!d) return;
                      setEndDate(endOfDay(d));
                    }}
                    mode="date"
                    display="calendar"
                  />
                )}
              </>
            )}
          </View>

          <Text style={[styles.label, { marginTop: 8 }]}>Category limits</Text>
          <View style={{ maxHeight: 220 }}>
            {selectedCategories.map(c => (
              <View key={c.name} style={styles.catRow}>
                <Text style={styles.catName}>{c.name}</Text>
                <TextInput
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={categoryBudgets[c.name] || ''}
                  onChangeText={(v) => setCategoryBudgets(prev => ({ ...prev, [c.name]: v }))}
                  style={styles.amountInput}
                />
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreate} style={[styles.btn, styles.btnPrimary]}>
              <Text style={styles.btnPrimaryText}>{submitLabel || 'Create'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function getPeriodStart(base: Date, tf: TimeframeType): Date {
  const d = new Date(base);
  if (tf === 'weekly') {
    const day = d.getDay(); // 0 Sun
    const diff = (day + 6) % 7; // make Monday start
    d.setDate(d.getDate() - diff);
  } else if (tf === 'monthly') {
    d.setDate(1);
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

function getPeriodEnd(base: Date, tf: TimeframeType): Date {
  const d = new Date(base);
  if (tf === 'weekly') {
    const start = getPeriodStart(base, tf);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  } else if (tf === 'monthly') {
    d.setMonth(d.getMonth() + 1, 0); // last day of month
  }
  d.setHours(23, 59, 59, 999);
  return d;
}

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function toDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function beginOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function parseDate(dateStr: string, start: boolean): Date {
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    return start ? beginOfDay(d) : endOfDay(d);
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return start ? beginOfDay(dt) : endOfDay(dt);
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.backgroundSecondary, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12, fontFamily: Fonts.rounded },
  input: { backgroundColor: colors.surface, color: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, marginRight: 8 },
  chipActive: { backgroundColor: colors.accentBlue },
  chipText: { color: colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  datesRow: { marginBottom: 8 },
  label: { color: colors.textSecondary, fontWeight: '600', marginBottom: 8 },
  datePreview: { color: colors.textSecondary, marginTop: 6 },
  dateButton: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, alignSelf: 'flex-start' },
  dateButtonText: { color: colors.textPrimary, fontWeight: '600' },
  catRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  catName: { color: colors.textPrimary, fontSize: 14 },
  amountInput: { backgroundColor: colors.surface, color: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, minWidth: 90, textAlign: 'right' },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  btn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, marginLeft: 8 },
  btnGhost: { backgroundColor: colors.surface },
  btnGhostText: { color: colors.textPrimary, fontWeight: '700' },
  btnPrimary: { backgroundColor: colors.accentBlue },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});
