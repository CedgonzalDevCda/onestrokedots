import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from "react";

const { height } = Dimensions.get("window");

export type SlidingPanelHandle = {
  expand: () => void;
  collapse: () => void;
};

type Props = {
  children: ReactNode;
  isScrollActive?: boolean;
  canDrag?: boolean;
};

// ✅ PANEL CACHÉ AU DÉMARRAGE
const MIN_HEIGHT = 0;
const MAX_HEIGHT = height * 0.85;

const SlidingPanel = forwardRef<SlidingPanelHandle, Props>(
  ({ children, isScrollActive = false, canDrag = true }, ref) => {
    const panelHeight = useSharedValue(MIN_HEIGHT);
    const startHeight = useSharedValue(MIN_HEIGHT);

    useImperativeHandle(ref, () => ({
      expand: () => {
        panelHeight.value = withSpring(MAX_HEIGHT);
      },
      collapse: () => {
        panelHeight.value = withSpring(MIN_HEIGHT);
      },
    }));

    const gesture = Gesture.Pan()
      .enabled(!isScrollActive && canDrag)
      .onBegin(() => {
        startHeight.value = panelHeight.value;
      })
      .onUpdate((e) => {
        const next = startHeight.value - e.translationY;

        if (next >= MIN_HEIGHT && next <= MAX_HEIGHT) {
          panelHeight.value = next;
        }
      })
      .onEnd(() => {
        const middle = (MIN_HEIGHT + MAX_HEIGHT) / 2;

        panelHeight.value = withSpring(
          panelHeight.value > middle ? MAX_HEIGHT : MIN_HEIGHT
        );
      });

    const animatedStyle = useAnimatedStyle(() => ({
      height: panelHeight.value,
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.panel, animatedStyle]}>
          
          {/* ✅ HANDLE VISUEL */}
          <View style={styles.handle} />

          {children}
        </Animated.View>
      </GestureDetector>
    );
  }
);

export default SlidingPanel;

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginVertical: 8,
  },
});