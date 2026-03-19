import { View, Button, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"
import { AdBanner } from "@/src/ads/AdBanner"

export default function LevelSelect() {
  return (
    <View style={styles.container}>

      {/* ✅ Bannière sticky */}
      <View style={styles.banner}>
        <AdBanner placement="world_levels" />
      </View>

      {/* ✅ Contenu scrollable */}
      <ScrollView contentContainerStyle={styles.content}>

        <Button
          title="Level 1"
          onPress={() => router.push("/play")}
        />

        {/* 👉 tu pourras en ajouter d'autres ici */}
        {/* <Button title="Level 2" ... /> */}

      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  banner: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 4,

    // effet pro
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  }
})
