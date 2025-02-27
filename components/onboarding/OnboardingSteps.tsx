import Text from "../ui/Text";

export default function OnboardingSteps({
  stepNumber,
}: {
  stepNumber: number;
}) {
  return (
    <Text weight="semibold" style={{ marginTop: 32 }}>
      Step {stepNumber} of 4
    </Text>
  );
}
