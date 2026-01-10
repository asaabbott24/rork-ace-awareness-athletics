import { Tabs } from "expo-router";
import { Home, Dumbbell, BookOpen, User, Shield, Eye, Waves } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import Colors from "@/constants/colors";
import ClutchButton from "@/components/ClutchButton";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: {
            backgroundColor: '#121212',
            borderTopColor: '#333',
            borderTopWidth: 1,
            paddingTop: 10,
            height: Platform.OS === "ios" ? 90 : 70,
          },
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: "600" as const,
            marginBottom: 5,
            textTransform: 'uppercase' as const,
            letterSpacing: 0,
          },
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: "700" as const,
            fontSize: 18,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Zone",
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="training"
          options={{
            title: "Train",
            tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: "Journal",
            tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="zone"
          options={{
            title: "FLOW",
            tabBarLabel: "FLOW",
            headerShown: false,
            tabBarStyle: { display: 'none' },
            tabBarIcon: ({ color, size }) => <Waves color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="loadout"
          options={{
            title: "Bag",
            tabBarIcon: ({ color, size }) => <Shield color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="vision"
          options={{
            title: "Eye",
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Eye color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
      <ClutchButton visible={true} />
    </>
  );
}
