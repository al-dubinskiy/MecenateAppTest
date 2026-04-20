import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ViewStyle, ActivityIndicator } from "react-native";
import { colors, spacing, borderRadius, componentSizes } from "../theme/tokens";
import { textStyles } from "../theme/typography";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  loading?: boolean,
  containerStyle?: ViewStyle
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, loading, containerStyle = {} }) => {
  return (
    <View style={[styles.errorContainer, containerStyle]}>
      <Image
        source={require("../../assets/illustration_sticker.png")}
        style={styles.errorImage}
      />
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        {loading ? <ActivityIndicator size={'small'} color={colors.textWhite} /> :<Text style={styles.retryText}>Повторить</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.lg,
  },
  errorImage: {
    width: 112,
    height: 112,
  },
  errorText: {
    ...textStyles.labelBold,
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xxl,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: componentSizes.button.height
  },
  retryText: {
    ...textStyles.h4,
    color: colors.textWhite,
    fontSize: 15
  },
});
