import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";


export  type Currency = "Gold" | "Bulbs" | "Hearts";

type Props = {
  onChange?: (value: Currency) => void;
};

const OPTIONS: Currency[] = ["Gold", "Bulbs", "Hearts"];

export default function CurrencyToggle({ onChange }: Props) {
  const [selected, setSelected] = useState<number>(0);

  const handlePress = (index: number) => {
    setSelected(index);
    onChange?.(OPTIONS[index] as Currency);
  };
  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        {OPTIONS.map((label, index) => {
          const isActive = selected === index;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => handlePress(index)}
              activeOpacity={0.8}
            >
              <Text style={[styles.text, isActive && styles.activeText]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },

  toggle: {
    flexDirection: "row",
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: "#FFD700",
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
  },

  activeButton: {
    backgroundColor: "#FFD700",
  },

  text: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  activeText: {
    color: "#0F172A",
    fontWeight: "bold",
  },
});
