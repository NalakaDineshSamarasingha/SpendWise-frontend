// components/home/GreetingHeader.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import colors from "../../constants/color";

interface GreetingHeaderProps {
  name: string;
  profileImage?: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function GreetingHeader({ name, profileImage }: GreetingHeaderProps) {
  return (
    <>
      {/* Greeting (fixed at top) */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>
          {getGreeting()}{name ? `, ${name}` : ''}!
        </Text>
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </Text>
          )}
        </View>
       
        <Icon name="bell" size={24} color= {colors.accentBlue}/>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  greetingBox: {
    padding: 20,
    paddingBottom: 20,
    paddingTop: 54,
    backgroundColor: colors.backgroundSecondary,
    zIndex: 2,
  },
  greetingText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: colors.textPrimary 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20 
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: colors.accentBlue, 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden' 
  },
  avatarImage: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },
  avatarText: { 
    color: colors.textSecondary, 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});
