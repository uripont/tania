import { StyleSheet, TextStyle } from 'react-native';

export const colors = {
  background: '#13101E',
  white: '#FFFFFF',
  highlighted: '#97A3DA',
  taniaHair: '#E04E4E',
  actionFilled: '#7684BE',
  actionStroke: '#5F6FB1',
};

export const margins = {
  sideMargin: 15,
  spacing1: 10,
  spacing2: 20,
  spacing3: 30,
};

export const typography = {
  actionText: {
    fontSize: 18,
  },
};

export const textStyles = StyleSheet.create({
  primaryActionButton: {
    color: colors.white,
    ...(typography.actionText as TextStyle),
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  secondaryActionButton: {
    color: colors.actionStroke,
    ...(typography.actionText as TextStyle),
  },
});
