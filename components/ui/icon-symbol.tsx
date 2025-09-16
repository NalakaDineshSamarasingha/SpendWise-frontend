// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'] | string, ComponentProps<typeof MaterialIcons>['name']>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Existing
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'link': 'link',
  'plus': 'add',
  'pie-chart': 'pie-chart',
  'user': 'person',
  // Additional common symbols used in app
  'person': 'person',
  'person.circle': 'account-circle',
  'pencil': 'edit',
  'gear': 'settings',
  'arrow.up.doc': 'file-upload',
  'rectangle.portrait.and.arrow.right': 'logout',
  'arrow.up.right': 'trending-up',
  'arrow.down.right': 'trending-down',
  'hourglass': 'hourglass-empty',
  // New aliases to avoid invalid names causing blank/white icons
  'home': 'home',
  'receipt-long': 'receipt',
  'receipt': 'receipt',
  'donut-large': 'donut-large',
  'calendar': 'calendar-today',
  'calendar-today': 'calendar-today',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialName = (MAPPING as any)[name] ?? (name as ComponentProps<typeof MaterialIcons>['name']);
  return <MaterialIcons color={color} size={size} name={materialName} style={style} />;
}
