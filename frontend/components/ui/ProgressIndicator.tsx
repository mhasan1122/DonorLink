import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  stepTitles = [] 
}: ProgressIndicatorProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progressPercentage}%` }
          ]} 
        />
      </View>
      
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <View key={stepNumber} style={styles.stepContainer}>
              <View style={[
                styles.stepCircle,
                isCompleted && styles.stepCircleCompleted,
                isCurrent && styles.stepCircleCurrent,
              ]}>
                <Text style={[
                  styles.stepNumber,
                  isCompleted && styles.stepNumberCompleted,
                  isCurrent && styles.stepNumberCurrent,
                ]}>
                  {isCompleted ? '✓' : stepNumber}
                </Text>
              </View>
              
              {stepTitles[index] && (
                <Text style={[
                  styles.stepTitle,
                  isCurrent && styles.stepTitleCurrent,
                ]}>
                  {stepTitles[index]}
                </Text>
              )}
            </View>
          );
        })}
      </View>
      
      <Text style={styles.progressText}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D32F2F',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepCircleCurrent: {
    backgroundColor: '#D32F2F',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  stepNumberCompleted: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  stepNumberCurrent: {
    color: '#FFFFFF',
  },
  stepTitle: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  stepTitleCurrent: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
});
