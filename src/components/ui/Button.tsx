import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onPress,
  children,
}) => {
  const isDisabled = disabled || loading;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: '#3B82F6', text: '#FFFFFF' };
      case 'secondary':
        return { bg: '#F3F4F6', text: '#111827' };
      case 'outline':
        return { bg: 'transparent', text: '#3B82F6', border: '#3B82F6' };
      case 'ghost':
        return { bg: 'transparent', text: '#3B82F6' };
      case 'danger':
        return { bg: '#EF4444', text: '#FFFFFF' };
      default:
        return { bg: '#3B82F6', text: '#FFFFFF' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { height: 36, paddingHorizontal: 12, fontSize: 14 };
      case 'md':
        return { height: 44, paddingHorizontal: 16, fontSize: 16 };
      case 'lg':
        return { height: 52, paddingHorizontal: 20, fontSize: 18 };
      default:
        return { height: 44, paddingHorizontal: 16, fontSize: 16 };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.bg,
          height: sizeStyles.height,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderWidth: variantStyles.border ? 1 : 0,
          borderColor: variantStyles.border,
          width: fullWidth ? '100%' : 'auto',
          opacity: isDisabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {loading && <ActivityIndicator size="small" color={variantStyles.text} style={{ marginRight: 8 }} />}
        {!loading && leftIcon && (
          <Ionicons name={leftIcon} size={sizeStyles.fontSize + 4} color={variantStyles.text} style={{ marginRight: 8 }} />
        )}
        <Text style={[styles.text, { color: variantStyles.text, fontSize: sizeStyles.fontSize }]}>{children}</Text>
        {!loading && rightIcon && (
          <Ionicons name={rightIcon} size={sizeStyles.fontSize + 4} color={variantStyles.text} style={{ marginLeft: 8 }} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
