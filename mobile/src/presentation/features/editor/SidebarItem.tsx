import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { ROLE_COLORS, EDITOR_POINT_BORDER_COLOR, EditorPointRole } from './types';

interface SidebarItemProps {
  role: EditorPointRole;
  disabled: boolean;
  onDragStart: (role: EditorPointRole) => void;
  onDragEnd: (absoluteX: number, absoluteY: number) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  role,
  disabled,
  onDragStart,
  onDragEnd,
}) => {
  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      'worklet';
      runOnJS(onDragStart)(role);
    })
    .onEnd((event) => {
      'worklet';
      runOnJS(onDragEnd)(event.absoluteX, event.absoluteY);
    });

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          styles.item,
          { backgroundColor: ROLE_COLORS[role] },
          disabled && styles.disabled,
        ]}
      />
    </GestureDetector>
  );
};

export default SidebarItem;

const styles = StyleSheet.create({
  item: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: EDITOR_POINT_BORDER_COLOR,
  },
  disabled: {
    opacity: 0.3,
  },
});