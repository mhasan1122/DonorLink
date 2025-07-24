import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch
} from 'react-native';
import Slider from '@react-native-community/slider';
import Button from './Button';
import BloodGroupSelector from './BloodGroupSelector';
import { apiRequest, API_ENDPOINTS } from '../../config/api';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export interface FilterState {
  bloodGroups: string[];
  divisionId: string;
  zilaId: string;
  upazilaId: string;
  availableOnly: boolean;
  lastDonationWithin: number;
}

interface LocationData {
  id: number;
  name: string;
}

export default function FilterModal({ 
  visible, 
  onClose, 
  onApply, 
  initialFilters 
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [divisions, setDivisions] = useState<LocationData[]>([]);
  const [zilas, setZilas] = useState<LocationData[]>([]);
  const [upazilas, setUpazilas] = useState<LocationData[]>([]);

  useEffect(() => {
    if (visible) {
      fetchDivisions();
    }
  }, [visible]);

  useEffect(() => {
    if (filters.divisionId) {
      fetchZilas(filters.divisionId);
    } else {
      setZilas([]);
      setFilters(prev => ({ ...prev, zilaId: '', upazilaId: '' }));
    }
  }, [filters.divisionId]);

  useEffect(() => {
    if (filters.zilaId) {
      fetchUpazilas(filters.zilaId);
    } else {
      setUpazilas([]);
      setFilters(prev => ({ ...prev, upazilaId: '' }));
    }
  }, [filters.zilaId]);

  const fetchDivisions = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.DIVISIONS);
      setDivisions(data);
    } catch (error) {
      console.error('Error fetching divisions:', error);
    }
  };

  const fetchZilas = async (divisionId: string) => {
    try {
      const data = await apiRequest(API_ENDPOINTS.ZILAS(divisionId));
      setZilas(data);
    } catch (error) {
      console.error('Error fetching zilas:', error);
    }
  };

  const fetchUpazilas = async (zilaId: string) => {
    try {
      const data = await apiRequest(API_ENDPOINTS.UPAZILAS(zilaId));
      setUpazilas(data);
    } catch (error) {
      console.error('Error fetching upazilas:', error);
    }
  };

  const handleBloodGroupSelect = (bloodGroups: string) => {
    setFilters(prev => ({ 
      ...prev, 
      bloodGroups: bloodGroups ? bloodGroups.split(',') : [] 
    }));
  };

  const handleLocationSelect = (type: 'division' | 'zila' | 'upazila', value: string) => {
    if (type === 'division') {
      setFilters(prev => ({ ...prev, divisionId: value, zilaId: '', upazilaId: '' }));
    } else if (type === 'zila') {
      setFilters(prev => ({ ...prev, zilaId: value, upazilaId: '' }));
    } else {
      setFilters(prev => ({ ...prev, upazilaId: value }));
    }
  };

  const handleReset = () => {
    setFilters({
      bloodGroups: [],
      divisionId: '',
      zilaId: '',
      upazilaId: '',
      availableOnly: false,
      lastDonationWithin: 365,
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.bloodGroups.length > 0) count++;
    if (filters.divisionId) count++;
    if (filters.zilaId) count++;
    if (filters.upazilaId) count++;
    if (filters.availableOnly) count++;
    if (filters.lastDonationWithin < 365) count++;
    return count;
  };

  const renderLocationSelector = (
    title: string,
    data: LocationData[],
    selectedValue: string,
    onSelect: (value: string) => void,
    disabled: boolean = false
  ) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.locationScroll}
      >
        <TouchableOpacity
          style={[
            styles.locationChip,
            !selectedValue && styles.locationChipSelected
          ]}
          onPress={() => onSelect('')}
          disabled={disabled}
        >
          <Text style={[
            styles.locationChipText,
            !selectedValue && styles.locationChipTextSelected
          ]}>
            All
          </Text>
        </TouchableOpacity>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.locationChip,
              selectedValue === item.id.toString() && styles.locationChipSelected,
              disabled && styles.locationChipDisabled
            ]}
            onPress={() => onSelect(item.id.toString())}
            disabled={disabled}
          >
            <Text style={[
              styles.locationChipText,
              selectedValue === item.id.toString() && styles.locationChipTextSelected,
              disabled && styles.locationChipTextDisabled
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filter Donors</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <BloodGroupSelector
            selectedBloodGroup=""
            selectedGroups={filters.bloodGroups}
            onSelect={handleBloodGroupSelect}
            multiSelect={true}
          />

          {renderLocationSelector(
            'Division',
            divisions,
            filters.divisionId,
            (value) => handleLocationSelect('division', value)
          )}

          {renderLocationSelector(
            'Zila',
            zilas,
            filters.zilaId,
            (value) => handleLocationSelect('zila', value),
            !filters.divisionId
          )}

          {renderLocationSelector(
            'Upazila',
            upazilas,
            filters.upazilaId,
            (value) => handleLocationSelect('upazila', value),
            !filters.zilaId
          )}

          <View style={styles.sectionContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.sectionTitle}>Available Only</Text>
              <Switch
                value={filters.availableOnly}
                onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, availableOnly: value }))
                }
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={filters.availableOnly ? '#FFFFFF' : '#CCCCCC'}
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              Last Donated Within: {filters.lastDonationWithin} days
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={30}
              maximumValue={365}
              step={30}
              value={filters.lastDonationWithin}
              onValueChange={(value) => 
                setFilters(prev => ({ ...prev, lastDonationWithin: value }))
              }
              minimumTrackTintColor="#D32F2F"
              maximumTrackTintColor="#E0E0E0"
              thumbStyle={{ backgroundColor: '#D32F2F' }}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>30 days</Text>
              <Text style={styles.sliderLabel}>1 year</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={`Apply Filters (${getActiveFilterCount()})`}
            onPress={handleApply}
            variant="primary"
            size="large"
            style={styles.applyButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  locationScroll: {
    flexDirection: 'row',
  },
  locationChip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  locationChipSelected: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  locationChipDisabled: {
    backgroundColor: '#F0F0F0',
    opacity: 0.5,
  },
  locationChipText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  locationChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  locationChipTextDisabled: {
    color: '#CCCCCC',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666666',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  applyButton: {
    width: '100%',
  },
});
