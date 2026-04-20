import { StyleSheet, Platform } from 'react-native';
import { colors, typography } from './tokens';

export const textStyles = StyleSheet.create({
  // Заголовки
  h1: {
    fontSize: typography.sizes.huge,
    lineHeight: typography.lineHeights.huge,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
  },
  h2: {
    fontSize: typography.sizes.xxxl,
    lineHeight: typography.lineHeights.xxxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
  },
  h3: {
    fontSize: typography.sizes.xxl,
    lineHeight: typography.lineHeights.xxl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.semibold,
  },
  h4: {
    fontSize: typography.sizes.xl,
    lineHeight: typography.lineHeights.xl,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.semibold,
  },
  labelBold: {
    fontSize: typography.sizes.lg,
    lineHeight: typography.lineHeights.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
  },
  labelBoldMedium: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
  },
  
  // Основной текст
  body: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.regular,
    color: colors.textPrimary,
    fontFamily: typography.fonts.regular,
  },
  bodyMedium: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
    fontFamily: typography.fonts.medium,
  },
  bodyBold: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.semibold,
  },
  bodySmall: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
    fontWeight: typography.weights.regular,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
  },
  bodySmallBold: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
  },
  
  // Подписи
  caption: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.lineHeights.xs,
    fontWeight: typography.weights.regular,
    color: colors.textTertiary,
    fontFamily: typography.fonts.regular,
  },
  captionBold: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.lineHeights.xs,
    fontWeight: typography.weights.medium,
    color: colors.textTertiary,
    fontFamily: typography.fonts.medium,
  },
  // Кнопки
  button: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.semibold,
  },
  buttonSmall: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.medium,
  },
  
  // Табы
  tab: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.medium,
  },
  tabActive: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fonts.semibold,
  },
  
  // Счетчики (лайки, комментарии)
  counter: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.lineHeights.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fonts.medium,
  },
});