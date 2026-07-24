import { View, Text, StyleSheet } from "react-native"
import { router } from "expo-router"
import BackButton from "@/src/presentation/ui/components/BackButton"

export default function LevelSelectHeader({ title }: { title: string }) {
  return (
    <View style={styles.container}>

      {/* LEFT */}
      <View style={styles.side}>
        <BackButton onPress={() => router.back()} />
      </View>

      {/* CENTER */}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* RIGHT (symétrie) */}
      <View style={styles.side} />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  side: {
    marginLeft: 10,
    width: 60,
    alignItems: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
})
