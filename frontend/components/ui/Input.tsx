import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  containerStyle,
  labelStyle,
  required = false,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.base,
    styles[variant],
    styles[size],
    isFocused && styles.focused,
    error && styles.error,
    style
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={inputStyle}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor="#999999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  required: {
    color: '#D32F2F',
  },
  base: {
    fontSize: 16,
    color: '#333333',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
  },
  filled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 0,
  },
  small: {
    paddingVertical: 8,
    fontSize: 14,
  },
  medium: {
    paddingVertical: 12,
    fontSize: 16,
  },
  large: {
    paddingVertical: 16,
    fontSize: 18,
  },
  focused: {
    borderColor: '#1976D2',
    borderWidth: 2,
  },
  error: {
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});
