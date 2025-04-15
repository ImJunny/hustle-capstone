import * as React from "react";
import { Html, Text } from "@react-email/components";

export function EmailTemplate() {
  return (
    <Html lang="en">
      <Text>Test email</Text>
    </Html>
  );
}
