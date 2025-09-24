import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AddDestinationModal,
  NewDestination,
} from "../components/planTrip/AddDestinationModal"; // import your modal

export default function PlanTripScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDestination, setNewDestination] = useState<NewDestination>({
    location: "",
    date: new Date(),
    totalBudget: "",
    transport: "",
    stay: "",
    food: "",
    other: "",
  });


  useEffect(() => {
    console.log("[PlanTripScreen] mounted");
    return () => console.log("[PlanTripScreen] unmounted");
  }, []);

  const handleBack = () => {
    try {
      if (router.canGoBack()) router.back();
      else router.replace("/");
    } catch (e) {
      console.warn("Back navigation failed:", e);
      router.replace("/");
    }
  };

  const handleAddDestination = () => {
    console.log("New Destination:", newDestination);
    // TODO: save destination or navigate
    setShowAddModal(false);
    router.push("/"); // or any other screen
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Plan Trip</Text>
      </View>

      {/* Travel Destinations Header with Add Button */}
      <View style={styles.sectionHeaderBox}>
        <Text style={styles.sectionHeader}>Travel Destinations</Text>
        <TouchableOpacity
          style={styles.addDestinationBtn}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addBtnText}>＋</Text>
          <Text style={styles.addBtnLabel}>Add new destination</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>Your trip list will appear here.</Text>
      </View>

      {/* Add Destination Modal */}
      <AddDestinationModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        newDestination={newDestination}
        setNewDestination={setNewDestination}
        onAdd={handleAddDestination}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginRight: 10,
  },
  backTxt: { color: "#334155", fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
  sectionHeaderBox: {
    backgroundColor: "#392D91",
    borderRadius: 14,
    paddingVertical: 50,
    paddingHorizontal: 18,
    marginBottom: 16,
    width: "100%",
  },
  sectionHeader: {
    fontSize: 26,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 10,
  },
  addDestinationBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
  },
  addBtnText: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "bold",
    marginRight: 10,
    borderRadius: 30,
    borderColor: "#ffffff",
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  addBtnLabel: { fontSize: 18, color: "#ffffff", fontWeight: "500" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholder: { textAlign: "center", color: "#64748B", lineHeight: 20 },
});
