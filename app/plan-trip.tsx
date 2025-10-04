import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import {
  AddDestinationModal,
  NewDestination,
} from "../components/planTrip/AddDestinationModal";
import colors from "@/constants/color";

const { width } = Dimensions.get("window");

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

  const [tripList, setTripList] = useState<NewDestination[]>([]); // store full trip info

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
    if (newDestination.location.trim() === "") return; // ignore empty location
    setTripList([...tripList, newDestination]); // add full destination
    setShowAddModal(false);
    setNewDestination({
      location: "",
      date: new Date(),
      totalBudget: "",
      transport: "",
      stay: "",
      food: "",
      other: "",
    });
  };

  const handleTripPress = (trip: NewDestination) => {
    // Navigate to details page and pass trip details
    router.push({
      pathname: "../components/planTrip/tripdetails",
      params: { trip: JSON.stringify(trip) },
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}></View>
      <Text style={styles.heroTitle}>Travel Destinations</Text>

      {/* Hero Section with Add New Destination */}
      <View style={styles.heroSection}>
        <View style={styles.heroGradient}>
         

          <TouchableOpacity
            style={styles.addDestinationBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.addBtnIcon}>
              <Text style={styles.addBtnText}>+</Text>
            </View>
            <Text style={styles.addBtnLabel}>Add new destination</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {tripList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No trips planned yet</Text>
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.plannedTripsHeader}>
                Your Planned Trips ({tripList.length})
              </Text>
            </View>

            <FlatList
              data={tripList}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tripsList}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleTripPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tripContent}>
                    <View style={styles.tripMainInfo}>
                      <Text style={styles.tripLocation}>{item.location}</Text>
                      <Text style={styles.tripDate}>
                        {formatDate(item.date)}
                      </Text>
                    </View>

                    <View style={styles.tripFooter}>
                      <Text style={styles.tapHint}>Tap to view details</Text>
                      
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}
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
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },

  heroSection: {
    marginBottom: 30,
  },
  heroGradient: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: "#1E1E1E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "400",
  },

  addDestinationBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  addBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addBtnText: {
    fontSize: 24,
    color: "#1E1E1E",
    fontWeight: "700",
  },
  addBtnLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    flex: 1,
  },

  content: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  plannedTripsHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  tripsList: {
    paddingBottom: 20,
  },
  tripItem: {
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  tripContent: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 30,
    margin:20,
  },
  tripMainInfo: {
    marginBottom: 13,
  },
  tripLocation: {
    fontSize: 20,
    fontWeight: "700",
    color:colors.textPrimary,
    marginBottom: 6,
  },
  tripDate: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  tripDetails: {
    marginBottom: 16,
  },
  
  
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(254, 254, 254, 0.1)",
  },
  tapHint: {
    fontSize: 14,
    color: colors.textPrimary,
    fontStyle: "italic",
  },
  
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
    textAlign: "center",
  },
  
});
