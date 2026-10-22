import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EditorHeader } from '../../features/editor/EditorHeader';
import { EditorSidebar } from '../../features/editor/EditorSidebar';
import {
  EditorCanvas,
  HEADER_EXCLUSION_HEIGHT,
  ACTIONBAR_EXCLUSION_HEIGHT,
} from '../../features/editor/EditorCanvas';
import { EditorActionBar } from '../../features/editor/EditorActionBar';
import {
  EditorPoint,
  EditorPointRole,
  SidebarPosition,
  createEditorPoint,
} from '../../features/editor/types';

interface CanvasLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const EditorLevelScreen: React.FC = () => {
  // ✅ TOUT LE STATE ICI
  const [points, setPoints] = useState<EditorPoint[]>([]);
  const [draggedRole, setDraggedRole] = useState<EditorPointRole | null>(null);
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>('right');
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const SIDEBAR_WIDTH = SCREEN_WIDTH * (76 / 390);

  const canvasLayoutRef = useRef<CanvasLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const hasStart = points.some((p) => p.role === 'start');
  const hasEnd = points.some((p) => p.role === 'end');

  const handleCanvasLayout = useCallback((layout: CanvasLayout) => {
    canvasLayoutRef.current = layout;
  }, []);

  const handleSidebarDragStart = useCallback((role: EditorPointRole) => {
    setDraggedRole(role);
  }, []);

  const handleSidebarDragEnd = useCallback(
    (absoluteX: number, absoluteY: number) => {
      const role = draggedRole;
      setDraggedRole(null);
      if (!role) return;

      const layout = canvasLayoutRef.current;
      const localX = absoluteX - layout.x;
      const localY = absoluteY - layout.y;

      if (
        localX < 0 ||
        localY < 0 ||
        localX > layout.width ||
        localY > layout.height
      ) {
        return;
      }

      if (
        localY < HEADER_EXCLUSION_HEIGHT ||
        localY > layout.height - ACTIONBAR_EXCLUSION_HEIGHT
      ) {
        return;
      }

      // Exclusion dynamique sidebar selon position
      if (sidebarPosition === 'right') {
        const canvasRight = layout.x + layout.width;
        const sidebarLeft = canvasRight - SIDEBAR_WIDTH;
        if (absoluteX > sidebarLeft) return;
      } else if (sidebarPosition === 'left') {
        const sidebarRight = layout.x + SIDEBAR_WIDTH;
        if (absoluteX < sidebarRight) return;
      }
      // TOP — pas d'exclusion horizontale, juste vérifier haut

      if (role === 'start' && hasStart) return;
      if (role === 'end' && hasEnd) return;

      const newPoint = createEditorPoint(role, localX, localY);
      setPoints((prev) => [...prev, newPoint]);
    },
    [draggedRole, hasStart, hasEnd, sidebarPosition],
  );

  const handlePointsChange = useCallback((next: EditorPoint[]) => {
    setPoints(next);
  }, []);

  const handleSimulate = useCallback(() => {
    // Placeholder
  }, []);

  const handleSave = useCallback(() => {
    // Placeholder
  }, []);

  const saveDisabled = !hasStart || !hasEnd;

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.root}>
        <EditorHeader />

        <EditorCanvas
          points={points}
          draggedRole={draggedRole}
          onPointsChange={handlePointsChange}
          onCanvasLayout={handleCanvasLayout}
        />

        <EditorSidebar
          hasStart={hasStart}
          hasEnd={hasEnd}
          onDragStart={handleSidebarDragStart}
          onDragEnd={handleSidebarDragEnd}
          position={sidebarPosition}
          onPositionChange={setSidebarPosition}
          isVisible={sidebarVisible}
          onVisibilityChange={setSidebarVisible}
        />

        <EditorActionBar
          onSimulate={handleSimulate}
          onSave={handleSave}
          saveDisabled={saveDisabled}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default EditorLevelScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
});