import { View, StyleSheet } from "react-native"

export default function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={styles.radio}>
      {selected && <View style={styles.inner} />}
    </View>
  )
}

const styles = StyleSheet.create({
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
})
