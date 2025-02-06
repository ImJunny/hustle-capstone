import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function ClickableContainer({ onPress, children }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ClickableContainer;
