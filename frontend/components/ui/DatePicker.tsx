import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import Button from './Button';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  required = false,
  error,
  minimumDate,
  maximumDate
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateSelect = () => {
    onChange(formatDate(selectedDate));
    setShowPicker(false);
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    const maxDate = maximumDate || today;
    const minDate = minimumDate || new Date(today.getFullYear() - 100, 0, 1);

    // Generate years
    const currentYear = today.getFullYear();
    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();

    for (let year = maxYear; year >= minYear; year--) {
      dates.push({ type: 'year', value: year, label: year.toString() });
    }

    return dates;
  };

  const renderSimpleDatePicker = () => {
    const years = [];
    const months = [];
    const days = [];

    // Generate years (last 100 years)
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 100; year--) {
      years.push(year);
    }

    // Generate months
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthNames.forEach((month, index) => {
      months.push({ name: month, value: index });
    });

    // Generate days (1-31)
    for (let day = 1; day <= 31; day++) {
      days.push(day);
    }

    return (
      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateInputContainer}>
              <Text style={styles.dateInputLabel}>Quick Select:</Text>
              <View style={styles.quickSelectContainer}>
                <Button
                  title="Today"
                  variant="secondary"
                  size="small"
                  onPress={() => {
                    setSelectedDate(new Date());
                    onChange(formatDate(new Date()));
                    setShowPicker(false);
                  }}
                  style={styles.quickSelectButton}
                />
                <Button
                  title="1 Month Ago"
                  variant="secondary"
                  size="small"
                  onPress={() => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - 1);
                    setSelectedDate(date);
                    onChange(formatDate(date));
                    setShowPicker(false);
                  }}
                  style={styles.quickSelectButton}
                />
                <Button
                  title="3 Months Ago"
                  variant="secondary"
                  size="small"
                  onPress={() => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - 3);
                    setSelectedDate(date);
                    onChange(formatDate(date));
                    setShowPicker(false);
                  }}
                  style={styles.quickSelectButton}
                />
              </View>
            </View>

            <View style={styles.manualInputContainer}>
              <Text style={styles.dateInputLabel}>Or enter manually:</Text>
              <Text style={styles.dateFormatHint}>Format: YYYY-MM-DD</Text>
              <View style={styles.dateDisplayContainer}>
                <Text style={styles.selectedDateText}>
                  {formatDisplayDate(formatDate(selectedDate))}
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setShowPicker(false)}
                style={styles.modalButton}
              />
              <Button
                title="Select"
                variant="primary"
                onPress={handleDateSelect}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.dateButton,
          error && styles.dateButtonError
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={[
          styles.dateButtonText,
          !value && styles.placeholderText
        ]}>
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {renderSimpleDatePicker()}
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateButtonError: {
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    color: '#999999',
  },
  calendarIcon: {
    fontSize: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
  },
  dateInputContainer: {
    marginBottom: 20,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  quickSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickSelectButton: {
    flex: 1,
    minWidth: 100,
  },
  manualInputContainer: {
    marginBottom: 20,
  },
  dateFormatHint: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  dateDisplayContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
