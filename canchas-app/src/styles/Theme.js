import { Platform } from 'react-native';

export const colors = {
  background: '#050712',
  surface: '#0c1326',
  card: '#101934',
  primary: '#7c3aed',
  primaryLight: '#c4b5fd',
  accent: '#22d3ee',
  accentDark: '#0ea5b7',
  secondary: '#eff6ff',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  placeholder: '#6d72c3',
  border: 'rgba(148,163,184,0.18)',
  danger: '#fb7185',
  success: '#22c55e',
};

export const spacing = {
  xxs: 6,
  xs: 10,
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 44,
};

export const radius = {
  small: 10,
  medium: 18,
  large: 26,
  rounded: 34,
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
  },
  android: {
    elevation: 8,
  },
});

export const globalStyles = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  elevatedCard: {
    backgroundColor: colors.card,
    borderRadius: radius.rounded,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.rounded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.secondary,
    fontWeight: '800',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#0f1a3b',
    borderWidth: 1,
    borderColor: '#243257',
    borderRadius: radius.medium,
    padding: spacing.sm,
    color: colors.text,
    fontSize: 16,
  },
  sectionTitle: {
    color: colors.secondary,
    fontSize: 32,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
};
