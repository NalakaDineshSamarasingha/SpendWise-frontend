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

export type NewDestination = {
  location: string;
  date: Date;
  totalBudget: string; // we keep as string for display
  transport: string;
  stay: string;
  food: string;
  other: string;
};

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

          <Text style={styles.inputLabel}>Planned Budget (Total)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Total budget"
            value={newDestination.totalBudget}
            editable={false} // make it read-only
          />

          <Text style={styles.inputLabel}>Budget Categories</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Transport"
            value={newDestination.transport}
            onChangeText={(text) =>
              setNewDestination({ ...newDestination, transport: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Stay"
            value={newDestination.stay}
            onChangeText={(text) =>
              setNewDestination({ ...newDestination, stay: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Food"
            value={newDestination.food}
            onChangeText={(text) =>
              setNewDestination({ ...newDestination, food: text })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Other"
            value={newDestination.other}
            onChangeText={(text) =>
              setNewDestination({ ...newDestination, other: text })
            }
            keyboardType="numeric"
          />

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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
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
    color: "#111827",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
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
});

