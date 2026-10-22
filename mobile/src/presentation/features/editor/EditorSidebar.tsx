import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
  FlexAlignType,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SidebarItem } from './SidebarItem';
import { EditorPointRole, SidebarPosition } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * (76 / 390);
const SIDEBAR_HEIGHT_VERTICAL = SCREEN_HEIGHT * (526 / 884);
const SIDEBAR_HEIGHT_TOP = 140; // Hauteur réduite quand en haut
const BUTTON_SIZE = 48;
const INDICATOR_SIZE = 3;
const EDITOR_HEADER_HEIGHT = 60; // Hauteur EditorHeader

interface EditorSidebarProps {
  hasStart: boolean;
  hasEnd: boolean;
  onDragStart: (role: EditorPointRole) => void;
  onDragEnd: (absoluteX: number, absoluteY: number) => void;
  position: SidebarPosition;
  onPositionChange: (position: SidebarPosition) => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  hasStart,
  hasEnd,
  onDragStart,
  onDragEnd,
  position,
  onPositionChange,
  isVisible,
  onVisibilityChange,
}) => {
  const dragOffsetX = useSharedValue(0);
  const dragOffsetY = useSharedValue(0);

  // Pin drag → repositionnement
  const pinGesture = Gesture.Pan()
    .onUpdate((event) => {
      'worklet';
      dragOffsetX.value = event.translationX;
      dragOffsetY.value = event.translationY;
    })
    .onEnd((event) => {
      'worklet';
      const threshold = 50;
      const absX = Math.abs(event.translationX);
      const absY = Math.abs(event.translationY);

      let newPosition = position;

      // Si on est DÉJÀ en top, seul drag horizontal compte
      if (position === 'top') {
        if (absX > absY && absX > threshold) {
          if (event.translationX < 0) {
            newPosition = 'left';
          } else {
            newPosition = 'right';
          }
        }
        // Sinon reste 'top'
      }
      // Si on est LEFT ou RIGHT, drag horizontal prioritaire, sinon vertical
      else {
        // Drag dominant horizontal (left ↔ right)
        if (absX > absY && absX > threshold) {
          if (event.translationX < 0) {
            newPosition = 'left';
          } else {
            newPosition = 'right';
          }
        }
        // Drag dominant vertical vers le bas → top
        else if (absY > absX && event.translationY > threshold) {
          newPosition = 'top';
        }
      }

      if (newPosition !== position) {
        runOnJS(onPositionChange)(newPosition);
      }

      // Reset drag visuel
      dragOffsetX.value = withTiming(0, { duration: 200 });
      dragOffsetY.value = withTiming(0, { duration: 200 });
    });

  const dragAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dragOffsetX.value * 0.2 },
      { translateY: dragOffsetY.value * 0.2 },
    ],
  }));

  // Styles statiques par position
  const wrapperStyle: ViewStyle =
    position === 'left'
      ? styles.wrapperLeft
      : position === 'right'
      ? styles.wrapperRight
      : styles.wrapperTop;

  const containerStyle: ViewStyle =
    position === 'left' || position === 'right'
      ? styles.containerVertical
      : styles.containerHorizontal;

  const indicatorStyle: ViewStyle =
    position === 'left'
      ? styles.indicatorLeft
      : position === 'right'
      ? styles.indicatorRight
      : styles.indicatorTop;

  // Toggle visibility — SANS useCallback
  const handleToggleVisibility = () => {
    if (onVisibilityChange) {
      onVisibilityChange(!isVisible);
    }
  };

  if (!isVisible) {
    // Afficher UNIQUEMENT le bouton toggle quand caché
    return (
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={handleToggleVisibility}
        activeOpacity={0.7}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
    );
  }

  // Afficher la sidebar complète quand visible
  return (
    <>
      {/* Sidebar visible */}
      <View style={[wrapperStyle]}>
        {/* Indicateur */}
        <View style={[indicatorStyle]} />

        {/* Contenu */}
        <View style={[containerStyle]}>
          {/* Pin button — à l'intérieur de la sidebar */}
          <GestureDetector gesture={pinGesture}>
            <Animated.View style={[styles.pinButton, dragAnimStyle]}>
              <Text style={styles.pinIcon}>📌</Text>
            </Animated.View>
          </GestureDetector>
          <SidebarItem
            role="normal"
            disabled={false}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
          <SidebarItem
            role="start"
            disabled={hasStart}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
          <SidebarItem
            role="end"
            disabled={hasEnd}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </View>
      </View>

      {/* Toggle button (show/hide) — fixe haut-droite */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={handleToggleVisibility}
        activeOpacity={0.7}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
    </>
  );
};

export default EditorSidebar;

const styles = StyleSheet.create({
  // === WRAPPERS ===
  wrapperRight: {
    position: 'absolute',
    top: EDITOR_HEADER_HEIGHT,
    right: 0,
    width: SIDEBAR_WIDTH,
    height: SCREEN_HEIGHT - EDITOR_HEADER_HEIGHT,
    zIndex: 100,
    backgroundColor: '#1A1A1A',
  } as ViewStyle,

  wrapperLeft: {
    position: 'absolute',
    top: EDITOR_HEADER_HEIGHT,
    left: 0,
    width: SIDEBAR_WIDTH,
    height: SCREEN_HEIGHT - EDITOR_HEADER_HEIGHT,
    zIndex: 100,
    backgroundColor: '#1A1A1A',
  } as ViewStyle,

  wrapperTop: {
    position: 'absolute',
    top: EDITOR_HEADER_HEIGHT,
    left: 0,
    right: 0,
    height: SIDEBAR_HEIGHT_TOP,
    zIndex: 100,
    backgroundColor: '#1A1A1A',
  } as ViewStyle,

  // === INDICATEURS (3px) ===
  indicatorRight: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: INDICATOR_SIZE,
    height: '100%',
    backgroundColor: '#FFFFFF',
  } as ViewStyle,

  indicatorLeft: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: INDICATOR_SIZE,
    height: '100%',
    backgroundColor: '#FFFFFF',
  } as ViewStyle,

  indicatorTop: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: INDICATOR_SIZE,
    backgroundColor: '#FFFFFF',
  } as ViewStyle,

  // === CONTAINERS ===
  containerVertical: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center' as FlexAlignType,
    justifyContent: 'flex-start' as const,
    gap: 20,
  } as ViewStyle,

  containerHorizontal: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as FlexAlignType,
    justifyContent: 'flex-start' as const,
    gap: 20,
  } as ViewStyle,

  // === PIN BUTTON ===
  pinButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center' as const,
    alignItems: 'center' as FlexAlignType,
  } as ViewStyle,

  pinIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },

  // === TOGGLE BUTTON ===
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 50,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center' as const,
    alignItems: 'center' as FlexAlignType,
    zIndex: 101,
  } as ViewStyle,

  menuIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});