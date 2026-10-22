import React from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

interface EditorActionBarProps {
  onSimulate: () => void
  onSave: () => void
  saveDisabled?: boolean
}

export function EditorActionBar({ onSimulate, onSave, saveDisabled = false }: EditorActionBarProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={onSimulate}>
        <Text style={styles.label}>Simulate</Text>
      </Pressable>
      <Pressable
        style={[styles.button, saveDisabled && styles.buttonDisabled]}
        onPress={onSave}
        disabled={saveDisabled}
      >
        <Text style={[styles.label, saveDisabled && styles.labelDisabled]}>Save</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    zIndex: 9999,
  },
  button: {
    width: 124,
    height: 54,
    borderRadius: 20,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#4A4A4A',
    opacity: 0.5,
  },
  label: {
    color: 'black',
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  labelDisabled: {
    color: '#8A8A8A',
  },
})