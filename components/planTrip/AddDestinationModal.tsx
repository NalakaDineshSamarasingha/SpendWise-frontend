import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TripCategorySelector } from "./TripCategorySelector";
import colors from "@/constants/color";

export type NewDestination = {
  location: string;
  date: Date;
  totalBudget: string; // we keep as string for display
  transport: string;
  stay: string;
  food: string;
  other: string;
};

const budgetCategories = [
  { name: "Transport", icon: "car-outline", color: "#F59E0B" },
  { name: "Stay", icon: "bed-outline", color: "#10B981" },
  { name: "Food", icon: "restaurant-outline", color: "#EF4444" },
  { name: "Other", icon: "cash-outline", color: "#6366F1" },
];

export function AddDestinationModal({
  visible,
  onClose,
  newDestination,
  setNewDestination,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  newDestination: NewDestination;
  setNewDestination: (d: NewDestination) => void;
  onAdd: () => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Transport");

  // Update total budget whenever any category changes
  useEffect(() => {
    const transport = parseFloat(newDestination.transport) || 0;
    const stay = parseFloat(newDestination.stay) || 0;
    const food = parseFloat(newDestination.food) || 0;
    const other = parseFloat(newDestination.other) || 0;

    const total = transport + stay + food + other;
    setNewDestination({ ...newDestination, totalBudget: total.toString() });
  }, [
    newDestination.transport,
    newDestination.stay,
    newDestination.food,
    newDestination.other,
  ]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Destination</Text>

          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter location"
            value={newDestination.location}
            onChangeText={(text) =>
              setNewDestination({ ...newDestination, location: text })
            }
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity
            style={styles.textInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {newDestination.date
                ? newDestination.date.toISOString().split("T")[0]
                : "Select date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={newDestination.date || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios"); // keep open on iOS
                if (selectedDate) {
                  setNewDestination({ ...newDestination, date: selectedDate });
                }
              }}
            />
          )}

          <Text style={styles.inputLabel}>Budget Categories</Text>
          <TripCategorySelector
            categories={budgetCategories}
            selected={selectedCategory}
            onSelect={(name) => setSelectedCategory(name)}
          />

          <TextInput
            style={styles.textInput}
            placeholder={`Enter ${selectedCategory} budget`}
            value={
              newDestination[
                selectedCategory.toLowerCase() as keyof NewDestination
              ] as string
            }
            onChangeText={(text) =>
              setNewDestination({
                ...newDestination,
                [selectedCategory.toLowerCase()]: text,
              })
            }
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Planned Budget (Total)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Total budget"
            value={newDestination.totalBudget}
            editable={false}
          />

          {/* New Summary Section */}
          <View style={styles.expenseSummary}>
            <Text style={styles.expenseSummaryTitle}>
              Your Expense Breakdown
            </Text>
            <View style={styles.expenseRow}>
              <Text style={styles.expenseLabel}> Transport:</Text>
              <Text style={styles.expenseValue}>
                {newDestination.transport || "0"}
              </Text>
            </View>
            <View style={styles.expenseRow}>
              <Text style={styles.expenseLabel}> Stay:</Text>
              <Text style={styles.expenseValue}>
                {newDestination.stay || "0"}
              </Text>
            </View>
            <View style={styles.expenseRow}>
              <Text style={styles.expenseLabel}> Food:</Text>
              <Text style={styles.expenseValue}>
                {newDestination.food || "0"}
              </Text>
            </View>
            <View style={styles.expenseRow}>
              <Text style={styles.expenseLabel}> Other:</Text>
              <Text style={styles.expenseValue}>
                {newDestination.other || "0"}
              </Text>
            </View>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "'rgba(255,255,255,0.1)'",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: colors.textPrimary,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#ffffffff",
    marginBottom: 8,
  },
  modalButtons: { flexDirection: "row", marginTop: 24 },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: "center",
  },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  addButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  addButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  expenseSummary: {
    marginTop: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  expenseSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  expenseLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  expenseValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
});
