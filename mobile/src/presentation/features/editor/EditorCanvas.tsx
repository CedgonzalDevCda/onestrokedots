import React, { useCallback, useRef } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { CanvasPoint } from './CanvasPoint';
import { EditorPoint, EditorPointRole, createEditorPoint } from './types';

export const HEADER_EXCLUSION_HEIGHT = 103;
export const ACTIONBAR_EXCLUSION_HEIGHT = 90;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * (76 / 390);

interface CanvasLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EditorCanvasProps {
  points: EditorPoint[];
  draggedRole: EditorPointRole | null;
  onPointsChange: (points: EditorPoint[]) => void;
  onCanvasLayout?: (layout: CanvasLayout) => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  points,
  draggedRole,
  onPointsChange,
  onCanvasLayout,
}) => {
  const layoutRef = useRef<CanvasLayout>({ x: 0, y: 0, width: 0, height: 0 });

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { x, y, width, height } = event.nativeEvent.layout;
      layoutRef.current = { x, y, width, height };
      onCanvasLayout?.({ x, y, width, height });
    },
    [onCanvasLayout],
  );

  // ✅ Check si position est en zone interdite (header, actionbar, sidebar)
  const isInExclusionZone = useCallback((y: number, x: number) => {
    const { height } = layoutRef.current;
    
    // Header
    if (y < HEADER_EXCLUSION_HEIGHT) return true;
    
    // Action bar
    if (y > height - ACTIONBAR_EXCLUSION_HEIGHT) return true;
    
    // Sidebar (right edge, width SIDEBAR_WIDTH)
    const canvasRight = layoutRef.current.x + layoutRef.current.width;
    const sidebarLeft = canvasRight - SIDEBAR_WIDTH;
    if (x > sidebarLeft) return true;
    
    return false;
  }, []);

  const handleMovePoint = useCallback(
    (id: string, x: number, y: number) => {
      if (isInExclusionZone(y, x)) return;
      onPointsChange(
        points.map((p) => (p.id === id ? { ...p, x, y } : p)),
      );
    },
    [points, onPointsChange, isInExclusionZone],
  );

  const handleChangeValue = useCallback(
    (id: string, value: number) => {
      onPointsChange(points.map((p) => (p.id === id ? { ...p, value } : p)));
    },
    [points, onPointsChange],
  );

  // ✅ DELETE POINT — appelé au final d'une animation shrink
  const handleDeletePoint = useCallback(
    (id: string) => {
      onPointsChange(points.filter((p) => p.id !== id));
    },
    [points, onPointsChange],
  );

  return (
    <View style={styles.canvas} onLayout={handleLayout}>
      {points.map((point) => {
        // Point est-il en train d'être dragué depuis sidebar ? (lifted)
        const isLifted = draggedRole !== null;
        
        return (
          <CanvasPoint
            key={point.id}
            point={point}
            isLifted={isLifted}
            onMove={handleMovePoint}
            onChangeValue={handleChangeValue}
            onDelete={handleDeletePoint}
          />
        );
      })}
    </View>
  );
};

export default EditorCanvas;

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    backgroundColor: '#0D0D0D',
  },
});