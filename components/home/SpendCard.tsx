import colors from "@/constants/color";
import { Colors } from "@/constants/theme";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SpenCard = ({
  headline = "Today",
  label = "Expenses",
  amount = 1030,
  currency = "LKR",
  transactions = 0,
  growthText = "+0% from yesterday",
}) => {
  const formatted = `${Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const growthValue = (() => {
    const m = typeof growthText === "string" ? growthText.match(/-?\d+(\.\d+)?/) : null;
    return m ? parseFloat(m[0]) : 0;
  })();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.labelRight}>{label}</Text>
      </View>

      <View style={styles.middleRow}>
        <Text style={styles.amount}>{formatted}<Text style={styles.currency}>{currency}</Text></Text>
        <Text style={styles.txCount}>{transactions} transactions</Text>
      </View>

     <View style={styles.bottomRow}>
        {growthValue > 0 && (
          <Text style={[styles.growth, styles.growthUp]}>⬆ {growthText}</Text>
        )}
        {growthValue < 0 && (
          <Text style={[styles.growth, styles.growthDown]}>
            ⬇ {growthText.replace("-", "")}
          </Text>
        )}
        {growthValue === 0 && (
          <Text style={[styles.growth, styles.growthFlat]}>
            — {growthText.replace(/[+-]/, "")}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  headline: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  labelRight: {
    color: colors.textDisabled,
    fontSize: 14,
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amount: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  txCount: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  bottomRow: {
    marginTop: 4,
  },
  growth: {
    fontSize: 12,
  },
  currency:{
    fontSize:12,
    color:colors.textSecondary
  },
   growthDown: { color: colors.accentGreen },
  growthUp: { color: colors.accentRed },
  growthFlat: { color: colors.accentBlue },
});

export default SpenCard;
