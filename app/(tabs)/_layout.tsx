import { IconSymbol } from "@/components/ui/icon-symbol";
import colors from "@/constants/color";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs, router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = colors.accentGreen;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const animationValue = useSharedValue(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      animationValue.value = withSpring(1, {
        damping: 18,
        stiffness: 180,
      });
    } else {
      animationValue.value = withTiming(0, { duration: 220 }, (finished) => {
        if (finished) {
          runOnJS(setIsMenuOpen)(false);
        }
      });
    }
  };

  const navigateAfterClose = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    animationValue.value = withTiming(0, { duration: 180 });
    setIsMenuOpen(false);
    requestAnimationFrame(() => {
      try {
        router.push(path as any);
      } catch (e) {
        console.warn("Navigation failed:", e);
      } finally {
        setTimeout(() => setIsNavigating(false), 250);
      }
    });
  };

  // Central "+" button with rotation
  const AddButton = () => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            rotate: `${interpolate(animationValue.value, [0, 1], [0, 45])}deg`,
          },
        ],
      };
    });

    return (
      <TouchableOpacity
        style={styles.addButtonContainer}
        activeOpacity={0.7}
        onPress={toggleMenu}
      >
        <View style={styles.addButton}>
          <Animated.View style={animatedStyle}>
            <IconSymbol size={32} name="plus" color="white" />
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  // Animated menu option
  const MenuOption = ({
    title,
    angle,
    onPress,
  }: {
    title: string;
    angle: number;
    onPress: () => void;
  }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(animationValue.value, [0, 1], [0, 1]);
      const translateX = interpolate(
        animationValue.value,
        [0, 1],
        [0, Math.cos(angle) * 120]
      );
      const translateY = interpolate(
        animationValue.value,
        [0, 1],
        [0, Math.sin(angle) * 120]
      );

      return {
        transform: [{ translateX }, { translateY }, { scale }],
        opacity: animationValue.value,
      };
    });
    return (
      <Animated.View style={[styles.menuOption, animatedStyle]}>
        <TouchableOpacity
          onPress={() => {
            if (!isNavigating) onPress();
          }}
          style={styles.menuOptionButton}
          disabled={isNavigating}
        >
          <Text style={styles.menuOptionText}>{title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
          tabBarLabelPosition: "below-icon",
          tabBarIconStyle: styles.tabIcon,
          tabBarAllowFontScaling: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: [
            styles.tabBar,
            { backgroundColor: colors.backgroundSecondary },
          ],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <View
                  style={[
                    styles.iconBg,
                    focused && {
                      backgroundColor: withOpacity(activeColor, 0.15),
                    },
                  ]}
                >
                  <IconSymbol
                    size={focused ? 26 : 24}
                    name="home"
                    color={color}
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Transaction",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <View
                  style={[
                    styles.iconBg,
                    focused && {
                      backgroundColor: withOpacity(activeColor, 0.15),
                    },
                  ]}
                >
                  <IconSymbol
                    size={focused ? 26 : 24}
                    name="receipt"
                    color={color}
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="middlebutton"
          options={{
            tabBarButton: () => <AddButton />,
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: "Budget",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <View
                  style={[
                    styles.iconBg,
                    focused && {
                      backgroundColor: withOpacity(activeColor, 0.15),
                    },
                  ]}
                >
                  <IconSymbol
                    size={focused ? 26 : 24}
                    name="donut-large"
                    color={color}
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <View
                  style={[
                    styles.iconBg,
                    focused && {
                      backgroundColor: withOpacity(activeColor, 0.15),
                    },
                  ]}
                >
                  <IconSymbol
                    size={focused ? 26 : 24}
                    name="person"
                    color={color}
                  />
                </View>
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Radial Menu Overlay */}
      {isMenuOpen && (
        <>
          <Animated.View style={[styles.backdrop, { opacity: animationValue }]}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={toggleMenu}
            />
          </Animated.View>

          <View style={styles.menuOverlay}>
            <View style={styles.menuContainer}>
              <MenuOption
                title="Plan Trip"
                angle={-Math.PI / 6.2}
                onPress={() => navigateAfterClose("/plan-trip")}
              />
              <MenuOption
                title="Save Goal"
                angle={-Math.PI / 2}
                onPress={() => navigateAfterClose("/save-goal")}
              />
              <MenuOption
                title="Manage Debt"
                angle={-Math.PI / 1.2}
                onPress={() => navigateAfterClose("/middlebutton/debt")}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 75,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 0,
    backgroundColor: colors.backgroundSecondary,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
    includeFontPadding: false as any,
  },
  tabItem: { paddingVertical: 6 },
  tabIcon: { paddingBottom: 0 },

  // Floating "+" button
  addButtonContainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accentGreen,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },

  // Menu overlay area
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  menuOverlay: {
    position: "absolute",
    bottom: 95, // higher than tab bar
    left: 0,
    right: 0,
    height: 250,
    justifyContent: "flex-end",
    alignItems: "center",
    pointerEvents: "box-none",
  },
  menuContainer: {
    position: "relative",
    width: 280,
    height: 230,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },

  // Radial buttons
  menuOption: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  menuOptionButton: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  menuOptionText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },

  iconWrap: { alignItems: "center", justifyContent: "center" },
  iconBg: { padding: 0, borderRadius: 20 },
});

function withOpacity(hex: string, opacity: number) {
  let h = hex.trim();
  if (!h.startsWith("#")) return hex;
  if (h.length === 4) h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r},${g},${b},${opacity})`;
}