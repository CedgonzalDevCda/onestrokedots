import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import EditModeBtnIcon from "@/assets/gameimg/edit-mode-btn-icon.svg"

export function EditorHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <EditModeBtnIcon width={32} height={32} />
      </View>
      <Text style={styles.title}>Edit Mode</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 35,
    left: 17,
    width: 355,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#426EFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    gap: 16,
    zIndex: 10,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 9,
    backgroundColor: '#000000',
    borderWidth: 2,
    borderColor: '#426EFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
})

export default EditorHeader