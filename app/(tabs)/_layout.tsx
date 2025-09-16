// app/(tabs)/_layout.tsx
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const activeColor = '#8B5CF6'; // Fixed active color to ensure visibility on white tab bar
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const animationValue = useSharedValue(0);

  // Toggle menu function
  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      animationValue.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      });
    } else {
      // Add exit animation with callback to close menu
      animationValue.value = withTiming(0, {
        duration: 200,
      }, (finished) => {
        if (finished) {
          runOnJS(setIsMenuOpen)(false);
        }
      });
    }
  };

  // Custom central "+" button
  const AddButton = ({ children }: any) => (
    <TouchableOpacity
      style={styles.addButtonContainer}
      activeOpacity={0.7}
      onPress={toggleMenu}
    >
      <View style={styles.addButton}>{children}</View>
    </TouchableOpacity>
  );

  // Animated menu items
  const MenuOption = ({ title, angle, onPress }: { title: string; angle: number; onPress: () => void }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(animationValue.value, [0, 1], [0, 1]);
      const translateX = interpolate(animationValue.value, [0, 1], [0, Math.cos(angle) * 120]);
      const translateY = interpolate(animationValue.value, [0, 1], [0, Math.sin(angle) * 120]);
      
      return {
        transform: [
          { translateX },
          { translateY },
          { scale }
        ],
        opacity: animationValue.value,
      };
    });

    return (
      <Animated.View style={[styles.menuOption, animatedStyle]}>
        <TouchableOpacity onPress={onPress} style={styles.menuOptionButton}>
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
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabLabel,
          tabBarItemStyle: styles.tabItem,
          tabBarLabelPosition: 'below-icon',
          tabBarIconStyle: styles.tabIcon,
          tabBarAllowFontScaling: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: [styles.tabBar, { backgroundColor: '#FFFFFF' }],
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <View style={[styles.iconBg, focused && { backgroundColor: withOpacity(activeColor, 0.15) }]}>
                  <IconSymbol size={focused ? 26 : 24} name="home" color={color} />
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
                <View style={[styles.iconBg, focused && { backgroundColor: withOpacity(activeColor, 0.15) }]}>
                  <IconSymbol size={focused ? 26 : 24} name="receipt" color={color} />
                </View>
              </View>
            ),
          }}
        />

        {/* Middle Add button */}
        <Tabs.Screen
          name="add"
          options={{
            tabBarButton: () => (
              <AddButton>
                <IconSymbol size={32} name="plus" color="white" />
              </AddButton>
            ),
          }}
        />

        <Tabs.Screen
          name="budget"
          options={{
            title: "Budget",
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.iconWrap}>
                <View style={[styles.iconBg, focused && { backgroundColor: withOpacity(activeColor, 0.15) }]}>
                  <IconSymbol size={focused ? 26 : 24} name="donut-large" color={color} />
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
                <View style={[styles.iconBg, focused && { backgroundColor: withOpacity(activeColor, 0.15) }]}>
                  <IconSymbol size={focused ? 26 : 24} name="person" color={color} />
                </View>
              </View>
            ),
          }}
        />
      </Tabs>
      
      {/* Animated radial menu overlay */}
      {isMenuOpen && (
        <>
          {/* Animated backdrop overlay */}
          <Animated.View 
            style={[
              styles.backdrop,
              {
                opacity: animationValue,
              }
            ]}
          >
            <TouchableOpacity 
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => {
                animationValue.value = withTiming(0, {
                  duration: 200,
                }, (finished) => {
                  if (finished) {
                    runOnJS(setIsMenuOpen)(false);
                  }
                });
              }}
            />
          </Animated.View>
          <View style={styles.menuOverlay}>
            <View style={styles.menuContainer}>
              <MenuOption 
                title="Plan Trip" 
                angle={-Math.PI / 6.2} 
                onPress={() => {
                  animationValue.value = withTiming(0, {
                    duration: 200,
                  }, (finished) => {
                    if (finished) {
                      runOnJS(setIsMenuOpen)(false);
                      // Handle Plan Trip action
                    }
                  });
                }} 
              />
              <MenuOption 
                title="Save Goal" 
                angle={-Math.PI / 2} 
                onPress={() => {
                  animationValue.value = withTiming(0, {
                    duration: 200,
                  }, (finished) => {
                    if (finished) {
                      runOnJS(setIsMenuOpen)(false);
                      // Handle Save Goal action
                    }
                  });
                }} 
              />
              <MenuOption 
                title="Plan Big Day" 
                angle={-Math.PI / 1.2} 
                onPress={() => {
                  animationValue.value = withTiming(0, {
                    duration: 200,
                  }, (finished) => {
                    if (finished) {
                      runOnJS(setIsMenuOpen)(false);
                      // Handle Plan Big Day action
                    }
                  });
                }} 
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
    height: 72,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 0,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 10,
    marginTop: 2,
    includeFontPadding: false as any,
  },
  tabItem: {
    paddingVertical: 6,
  },
  tabIcon: {
    paddingBottom: 0,
  },
  addButtonContainer: {
    top: -25, // lift above tab bar
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "green", // your primary color
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  iconBg: {
    padding: 0,
    borderRadius: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuOverlay: {
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  menuContainer: {
    position: 'relative',
    width: 300,
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  menuOption: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOptionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuOptionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

function withOpacity(hex: string, opacity: number) {
  // Support #RGB and #RRGGBB
  let h = hex.trim();
  if (!h.startsWith('#')) return hex;
  if (h.length === 4) {
    // #RGB -> #RRGGBB
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  if (!m) return hex;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
