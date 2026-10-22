import { Animated } from 'react-native';

export type SidebarPosition = 'left' | 'top' | 'right';

export interface DropZone {
  position: SidebarPosition;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type EditorPointRole = 'normal' | 'start' | 'end';

export const EDITOR_POINT_RADIUS = 32;

export const ROLE_COLORS: Record<EditorPointRole, string> = {
  normal: '#000000',
  start: '#FF87DB',
  end: '#AA00FF',
};

export const EDITOR_POINT_BORDER_COLOR = '#FAFAFA';

export type EditorPoint = {
  id: string;
  x: number;
  y: number;
  value: number;
  role: EditorPointRole;
  radius: 32;
  color: string;
};

export const createEditorPoint = (
  role: EditorPointRole,
  x: number,
  y: number,
): EditorPoint => ({
  id: `point-${Date.now()}-${Math.random()}`,
  x,
  y,
  value: 1,
  role,
  radius: EDITOR_POINT_RADIUS,
  color: ROLE_COLORS[role],
});

export interface SidebarItemProps {
  role: EditorPointRole;
  disabled: boolean;
  onDragStart: (role: EditorPointRole) => void;
  onDragEnd: (absoluteX: number, absoluteY: number) => void;
}

export interface EditorSidebarProps {
  hasStart: boolean;
  hasEnd: boolean;
  onDragStart: (role: EditorPointRole) => void;
  onDragEnd: (absoluteX: number, absoluteY: number) => void;
  position: SidebarPosition;
  onPositionChange: (position: SidebarPosition) => void;
}

export interface CanvasLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorCanvasProps {
  points: EditorPoint[];
  draggedRole: EditorPointRole | null;
  onPointsChange: (points: EditorPoint[]) => void;
  onCanvasLayout: (layout: CanvasLayout) => void;
}

export interface EditorHeaderProps {}

export interface EditorActionBarProps {
  onSimulate: () => void;
  onSave: () => void;
  saveDisabled: boolean;
}