import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  color?: keyof typeof Colors.light & keyof typeof Colors.dark
};

export function ThemedView({ style, color="background",...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(color);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
