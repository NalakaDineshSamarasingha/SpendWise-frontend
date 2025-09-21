import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PlanTripScreen() {
  useEffect(() => {
    console.log("[PlanTripScreen] mounted");
    return () => console.log("[PlanTripScreen] unmounted");
  }, []);

  const handleBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback to home instead of exiting app
        router.replace("/");
      }
    } catch (e) {
      console.warn("Back navigation failed:", e);
      router.replace("/");
    }
  };

  let body: React.ReactNode;
  try {
    body = (
      <View style={styles.content}>
        <Text style={styles.placeholder}>
          Plan Trip screen placeholder. Add your trip planning UI here.
        </Text>
      </View>
    );
  } catch (e) {
    console.error("PlanTripScreen render error:", e);
    body = (
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: "#DC2626" }]}>
          Failed to render Plan Trip screen.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backTxt}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Plan Trip</Text>
      </View>
      <View style={styles.sectionHeaderBox}>
        <Text style={styles.sectionHeader}>Travel Destinations</Text>
      </View>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          /* TODO: handle add destination */
        }}
      >
        <Text style={styles.addBtnText}>＋</Text>
      </TouchableOpacity>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    paddingHorizontal: 20,
  },
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
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  placeholder: { textAlign: "center", color: "#64748B", lineHeight: 20 },
  sectionHeaderBox: {
    backgroundColor: "#DDD6FE",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
    marginBottom: 16,
    marginLeft: 2,
    width: "100%",
  },
  sectionHeader: {
    fontSize: 25,
    fontWeight: "600",
    color: "#7C3AED",
  },
  addBtn: {
    alignSelf: "flex-start",
    marginLeft: 2,
    marginBottom: 10,
    backgroundColor: "#7efa86ff",
    borderRadius: 50,
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    fontSize: 38,
    color: "#c48b8bff",
    fontWeight: "bold",
    lineHeight: 44,
  },
});
