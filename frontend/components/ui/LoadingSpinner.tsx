import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  variant?: 'spinner' | 'bloodDrop' | 'pulse';
}

export default function LoadingSpinner({
  size = 'medium',
  color = '#D32F2F',
  text,
  variant = 'spinner'
}: LoadingSpinnerProps) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const pulseValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (variant === 'spinner') {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
      return () => spinAnimation.stop();
    } else if (variant === 'pulse') {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [variant]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'medium': return 40;
      case 'large': return 56;
      default: return 40;
    }
  };

  const renderSpinner = () => {
    const spinnerSize = getSize();
    
    if (variant === 'bloodDrop') {
      return (
        <Animated.View
          style={[
            styles.bloodDrop,
            {
              width: spinnerSize,
              height: spinnerSize,
              backgroundColor: color,
              transform: [{ scale: pulseValue }],
            }
          ]}
        >
          <Text style={[styles.dropEmoji, { fontSize: spinnerSize * 0.6 }]}>
            🩸
          </Text>
        </Animated.View>
      );
    }

    if (variant === 'pulse') {
      return (
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              width: spinnerSize,
              height: spinnerSize,
              borderColor: color,
              transform: [{ scale: pulseValue }],
            }
          ]}
        />
      );
    }

    return (
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderTopColor: color,
            transform: [{ rotate: spin }],
          }
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderSpinner()}
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinner: {
    borderWidth: 3,
    borderColor: '#f3f3f3',
    borderRadius: 50,
  },
  bloodDrop: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropEmoji: {
    color: '#FFFFFF',
  },
  pulseCircle: {
    borderWidth: 3,
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
