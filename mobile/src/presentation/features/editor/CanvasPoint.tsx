import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  EDITOR_POINT_BORDER_COLOR,
  EDITOR_POINT_RADIUS,
  EditorPoint,
} from './types';

interface CanvasPointProps {
  point: EditorPoint;
  isLifted: boolean;
  onMove: (id: string, x: number, y: number) => void;
  onChangeValue: (id: string, value: number) => void;
  onDelete: (id: string) => void;
}

export const CanvasPoint: React.FC<CanvasPointProps> = ({
  point,
  isLifted,
  onMove,
  onChangeValue,
  onDelete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const startX = useRef(point.x);
  const startY = useRef(point.y);
  const textInputRef = useRef<TextInput>(null);

  // Animation shrink pour suppression
  const shrinkRadius = useSharedValue(EDITOR_POINT_RADIUS);
  // Animation border (largeur + couleur)
  const borderWidth = useSharedValue(2);
  const borderColor = useSharedValue(EDITOR_POINT_BORDER_COLOR);

  const handleMove = (x: number, y: number) => {
    onMove(point.id, x, y);
  };

  // ✅ TAP COURT → Border bleu + focus input invisible
  const activateEditor = () => {
    borderWidth.value = withTiming(3, { duration: 150 });
    borderColor.value = withTiming('#426EFF', { duration: 150 });
    
    setTimeout(() => textInputRef.current?.focus(), 50);
  };

  const resetBorder = () => {
    borderWidth.value = withTiming(2, { duration: 150 });
    borderColor.value = withTiming(EDITOR_POINT_BORDER_COLOR, { duration: 150 });
  };

  // ✅ INPUT CHANGE
  const handleInputChange = (text: string) => {
    const sanitized = text.replace(/[^1-9]/g, '');
    if (sanitized) {
      const parsed = parseInt(sanitized, 10);
      if (parsed >= 1 && parsed <= 9) {
        onChangeValue(point.id, parsed);
        resetBorder();
        textInputRef.current?.blur();
      }
    }
  };

  // ✅ INPUT BLUR
  const handleInputBlur = () => {
    resetBorder();
  };

  // ✅ DELETE BUTTON
  const handleDeletePress = () => {
    shrinkRadius.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDelete)(point.id);
      }
    });
  };

  // ✅ PAN GESTURE (drag & drop) - déclenché après long press
  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      runOnJS(setIsDragging)(true);
      startX.current = point.x;
      startY.current = point.y;
    })
    .onUpdate((event) => {
      'worklet';
      const newX = startX.current + event.translationX;
      const newY = startY.current + event.translationY;
      runOnJS(handleMove)(newX, newY);
    })
    .onEnd(() => {
      'worklet';
      runOnJS(setIsDragging)(false);
    });

  // ✅ LONG PRESS (>= 300ms → déverrouille pan)
  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      'worklet';
      runOnJS(setIsDragging)(true);
      startX.current = point.x;
      startY.current = point.y;
    });

  // ✅ TAP COURT (< 250ms)
  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onEnd(() => {
      'worklet';
      runOnJS(activateEditor)();
    });

  // ✅ COMPOSITION : priorité longPress+pan > tap
  const composedGesture = Gesture.Exclusive(
    Gesture.Simultaneous(longPressGesture, panGesture),
    tapGesture,
  );

  // Animation shrink
  const animatedPointStyle = useAnimatedStyle(() => ({
    width: shrinkRadius.value * 2,
    height: shrinkRadius.value * 2,
    borderRadius: shrinkRadius.value,
    opacity: shrinkRadius.value > 0 ? 1 : 0,
    borderWidth: borderWidth.value,
    borderColor: borderColor.value,
  }));

  // Lifted opacity
  const pointOpacity = isLifted ? 0.4 : 1;

  return (
    <>
      {/* ✅ INPUT INVISIBLE */}
      <TextInput
        ref={textInputRef}
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
        keyboardType="number-pad"
        maxLength={1}
        onChangeText={handleInputChange}
        onBlur={handleInputBlur}
      />

<GestureDetector gesture={composedGesture}>
  <Animated.View
    style={[
      styles.point,
      animatedPointStyle,
      {
        // ✅ CENTRAGE : soustraire le rayon pour que le centre = (x, y)
        left: point.x - EDITOR_POINT_RADIUS,
        top: point.y - EDITOR_POINT_RADIUS,
        backgroundColor: point.color,
        opacity: pointOpacity,
      },
    ]}
  >
    <Text style={styles.valueText}>{point.value}</Text>

    {/* ✅ DELETE BUTTON */}
    <Pressable
      style={styles.deleteButton}
      onPress={handleDeletePress}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Text style={styles.deleteIcon}>✕</Text>
    </Pressable>
  </Animated.View>
</GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  point: {
    position: 'absolute',
    width: EDITOR_POINT_RADIUS * 2,
    height: EDITOR_POINT_RADIUS * 2,
    borderRadius: EDITOR_POINT_RADIUS,
    borderWidth: 2,
    borderColor: EDITOR_POINT_BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4848',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  deleteIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
  },
});

export default CanvasPoint;