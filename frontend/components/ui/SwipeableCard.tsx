import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity 
} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';

interface SwipeAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  onSwipeLeft,
  onSwipeRight
}: SwipeableCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const panRef = useRef<PanGestureHandler>(null);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      // Determine if swipe was significant enough
      const swipeThreshold = 100;
      const velocityThreshold = 500;
      
      if (translationX > swipeThreshold || velocityX > velocityThreshold) {
        // Swiped right
        if (onSwipeRight) {
          onSwipeRight();
        }
        // Animate to show right actions or reset
        Animated.spring(translateX, {
          toValue: rightActions.length > 0 ? 150 : 0,
          useNativeDriver: false,
        }).start();
      } else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
        // Swiped left
        if (onSwipeLeft) {
          onSwipeLeft();
        }
        // Animate to show left actions or reset
        Animated.spring(translateX, {
          toValue: leftActions.length > 0 ? -150 : 0,
          useNativeDriver: false,
        }).start();
      } else {
        // Reset to center
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    }
  };

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const renderActions = (actions: SwipeAction[], side: 'left' | 'right') => (
    <View style={[styles.actionsContainer, side === 'left' ? styles.leftActions : styles.rightActions]}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={[styles.actionButton, { backgroundColor: action.color }]}
          onPress={() => {
            action.onPress();
            resetPosition();
          }}
        >
          <Text style={styles.actionIcon}>{action.icon}</Text>
          <Text style={styles.actionTitle}>{action.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Left Actions */}
      {leftActions.length > 0 && renderActions(leftActions, 'left')}
      
      {/* Right Actions */}
      {rightActions.length > 0 && renderActions(rightActions, 'right')}
      
      {/* Main Card */}
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  leftActions: {
    left: 0,
    paddingLeft: 16,
  },
  rightActions: {
    right: 0,
    paddingRight: 16,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  actionTitle: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
