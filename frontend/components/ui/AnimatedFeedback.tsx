import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface AnimatedFeedbackProps {
  visible: boolean;
  type: 'success' | 'error' | 'info' | 'confetti';
  message: string;
  onComplete?: () => void;
  duration?: number;
}

const { width, height } = Dimensions.get('window');

export default function AnimatedFeedback({
  visible,
  type,
  message,
  onComplete,
  duration = 2000
}: AnimatedFeedbackProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const confettiAnims = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      if (type === 'confetti') {
        showConfetti();
      } else {
        showFeedback();
      }
    } else {
      hideFeedback();
    }
  }, [visible, type]);

  const showFeedback = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        hideFeedback();
      }, duration);
    });
  };

  const showConfetti = () => {
    // Show the success message first
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate confetti pieces
    const confettiAnimations = confettiAnims.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.y, {
          toValue: height + 100,
          duration: 3000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(anim.rotation, {
          toValue: Math.random() * 720,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(confettiAnimations).start(() => {
      setTimeout(() => {
        hideFeedback();
      }, 1000);
    });
  };

  const hideFeedback = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset confetti positions
      confettiAnims.forEach(anim => {
        anim.x.setValue(Math.random() * width);
        anim.y.setValue(-50);
        anim.rotation.setValue(0);
        anim.scale.setValue(1);
      });
      
      onComplete?.();
    });
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      case 'confetti': return '🎉';
      default: return '✅';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return '#4CAF50';
      case 'error': return '#D32F2F';
      case 'info': return '#1976D2';
      case 'confetti': return '#4CAF50';
      default: return '#4CAF50';
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Confetti pieces */}
      {type === 'confetti' && (
        <View style={styles.confettiContainer}>
          {confettiAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][index % 5],
                  transform: [
                    { translateX: anim.x },
                    { translateY: anim.y },
                    { rotate: anim.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      })
                    },
                    { scale: anim.scale },
                  ],
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Main feedback message */}
      <Animated.View
        style={[
          styles.feedbackContainer,
          {
            backgroundColor: getColor(),
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    pointerEvents: 'none',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  feedbackContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
