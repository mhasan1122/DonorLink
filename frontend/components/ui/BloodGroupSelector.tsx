import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BloodGroupSelectorProps {
  selectedBloodGroup: string;
  onSelect: (bloodGroup: string) => void;
  multiSelect?: boolean;
  selectedGroups?: string[];
  style?: any;
}

const BLOOD_GROUPS = [
  { value: 'A+', emoji: '🅰️', color: '#D32F2F' },
  { value: 'A-', emoji: '🅰️', color: '#C62828' },
  { value: 'B+', emoji: '🅱️', color: '#1976D2' },
  { value: 'B-', emoji: '🅱️', color: '#1565C0' },
  { value: 'AB+', emoji: '🆎', color: '#7B1FA2' },
  { value: 'AB-', emoji: '🆎', color: '#6A1B9A' },
  { value: 'O+', emoji: '⭕', color: '#388E3C' },
  { value: 'O-', emoji: '⭕', color: '#2E7D32' },
];

export default function BloodGroupSelector({
  selectedBloodGroup,
  onSelect,
  multiSelect = false,
  selectedGroups = [],
  style
}: BloodGroupSelectorProps) {
  const isSelected = (bloodGroup: string) => {
    if (multiSelect) {
      return selectedGroups.includes(bloodGroup);
    }
    return selectedBloodGroup === bloodGroup;
  };

  const handleSelect = (bloodGroup: string) => {
    if (multiSelect) {
      const newSelection = selectedGroups.includes(bloodGroup)
        ? selectedGroups.filter(bg => bg !== bloodGroup)
        : [...selectedGroups, bloodGroup];
      onSelect(newSelection.join(','));
    } else {
      onSelect(bloodGroup);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>
        {multiSelect ? 'Select Blood Groups' : 'Select Blood Group'}
      </Text>
      <View style={styles.grid}>
        {BLOOD_GROUPS.map((group) => (
          <TouchableOpacity
            key={group.value}
            style={[
              styles.bloodGroupButton,
              isSelected(group.value) && {
                backgroundColor: group.color,
                borderColor: group.color,
              }
            ]}
            onPress={() => handleSelect(group.value)}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>{group.emoji}</Text>
            <Text style={[
              styles.bloodGroupText,
              isSelected(group.value) && styles.selectedText
            ]}>
              {group.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bloodGroupButton: {
    width: '22%',
    height: 60, // Fixed height to create square buttons
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  bloodGroupText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});
