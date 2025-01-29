import View, { ViewProps } from "./View";

export default function Separator({
  style,
  color = "border",
  ...props
}: ViewProps) {
  return (
    <View color={color} style={[{ height: 1, flex: 1 }, style]} {...props} />
  );
}
