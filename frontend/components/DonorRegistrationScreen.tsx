import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Input,
  BloodGroupSelector,
  DatePicker,
  ProgressIndicator,
  LoadingSpinner,
  Card
} from "./ui";
import { API_ENDPOINTS, apiRequest } from "../config/api";

interface LocationData {
  id: number;
  name: string;
}

function DonorRegistrationScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bloodGroup: "",
    divisionId: "",
    zilaId: "",
    upazilaId: "",
    village: "",
    currentLocation: "",
    lastDonationDate: "",
    phoneNumber: "",
    isAvailable: true,
    notes: "",
    consent: false,
  });
  const [divisions, setDivisions] = useState<LocationData[]>([]);
  const [zilas, setZilas] = useState<LocationData[]>([]);
  const [upazilas, setUpazilas] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation();

  const stepTitles = ["Personal Info", "Blood & Health", "Location", "Review & Submit"];
  const totalSteps = 4;

  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    if (form.divisionId) {
      fetchZilas(form.divisionId);
    } else {
      setZilas([]);
      setForm(f => ({ ...f, zilaId: "", upazilaId: "" }));
    }
  }, [form.divisionId]);

  useEffect(() => {
    if (form.zilaId) {
      fetchUpazilas(form.zilaId);
    } else {
      setUpazilas([]);
      setForm(f => ({ ...f, upazilaId: "" }));
    }
  }, [form.zilaId]);

  const fetchDivisions = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.DIVISIONS);
      setDivisions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching divisions:', error);
      setDivisions([]);
      Alert.alert('Error', 'Failed to load divisions. Please check your internet connection and try again.');
    }
  };

  const fetchZilas = async (divisionId: string) => {
    try {
      const data = await apiRequest(API_ENDPOINTS.ZILAS(divisionId));
      setZilas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching zilas:', error);
      setZilas([]);
      Alert.alert('Error', 'Failed to load zilas. Please check your internet connection and try again.');
    }
  };

  const fetchUpazilas = async (zilaId: string) => {
    try {
      const data = await apiRequest(API_ENDPOINTS.UPAZILAS(zilaId));
      setUpazilas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching upazilas:', error);
      setUpazilas([]);
      Alert.alert('Error', 'Failed to load upazilas. Please check your internet connection and try again.');
    }
  };

  const handleChange = (key: string, value: any) => {
    setForm(f => ({ ...f, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1: // Personal Info
        if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        else if (!/^[0-9+\-\s()]+$/.test(form.phoneNumber)) {
          newErrors.phoneNumber = 'Please enter a valid phone number';
        }
        break;

      case 2: // Blood & Health
        if (!form.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        if (!form.lastDonationDate) newErrors.lastDonationDate = 'Last donation date is required';
        break;

      case 3: // Location
        if (!form.divisionId) newErrors.divisionId = 'Division is required';
        if (!form.zilaId) newErrors.zilaId = 'Zila is required';
        if (!form.upazilaId) newErrors.upazilaId = 'Upazila is required';
        if (!form.currentLocation.trim()) newErrors.currentLocation = 'Current location is required';
        break;

      case 4: // Review & Submit
        if (!form.consent) newErrors.consent = 'You must give consent to proceed';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    try {
      await apiRequest(API_ENDPOINTS.DONORS, {
        method: "POST",
        body: JSON.stringify(form),
      });

      Alert.alert(
        "🎉 Success!",
        "Welcome to the LifeDonor community! Your registration is complete.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
      Alert.alert("Error", errorMessage);
    }
    setLoading(false);
  };

  const renderStep1 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>👤 Personal Information</Text>
      <Text style={styles.stepDescription}>
        Let's start with your basic information
      </Text>

      <Input
        label="First Name"
        value={form.firstName}
        onChangeText={(value) => handleChange("firstName", value)}
        placeholder="Enter your first name"
        required
        error={errors.firstName}
      />

      <Input
        label="Last Name"
        value={form.lastName}
        onChangeText={(value) => handleChange("lastName", value)}
        placeholder="Enter your last name"
        required
        error={errors.lastName}
      />

      <Input
        label="Phone Number"
        value={form.phoneNumber}
        onChangeText={(value) => handleChange("phoneNumber", value)}
        placeholder="e.g., +880 1234-567890"
        keyboardType="phone-pad"
        required
        error={errors.phoneNumber}
      />
    </Card>
  );

  const renderStep2 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>🩸 Blood & Health Information</Text>
      <Text style={styles.stepDescription}>
        Help us understand your donation eligibility
      </Text>

      <BloodGroupSelector
        selectedBloodGroup={form.bloodGroup}
        onSelect={(bloodGroup) => handleChange("bloodGroup", bloodGroup)}
        style={styles.bloodGroupSelector}
      />
      {errors.bloodGroup && (
        <Text style={styles.errorText}>{errors.bloodGroup}</Text>
      )}

      <DatePicker
        label="Last Donation Date"
        value={form.lastDonationDate}
        onChange={(date) => handleChange("lastDonationDate", date)}
        placeholder="When did you last donate blood?"
        required
        error={errors.lastDonationDate}
        maximumDate={new Date()}
      />

      <Input
        label="Health Notes (Optional)"
        value={form.notes}
        onChangeText={(value) => handleChange("notes", value)}
        placeholder="Any health conditions or notes..."
        multiline
        numberOfLines={3}
      />
    </Card>
  );

  const renderLocationSelector = (
    title: string,
    data: LocationData[],
    selectedValue: string,
    onSelect: (value: string) => void,
    placeholder: string,
    error?: string
  ) => (
    <View style={styles.locationContainer}>
      <Text style={styles.locationLabel}>{title} *</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.locationScroll}
      >
        {Array.isArray(data) && data.filter(item => item && item.id && item.name).map((item) => (
          <Button
            key={item.id}
            title={item.name}
            variant={selectedValue === item.id.toString() ? "primary" : "secondary"}
            size="small"
            onPress={() => onSelect(item.id.toString())}
            style={styles.locationButton}
          />
        ))}
      </ScrollView>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const renderStep3 = () => (
    <Card style={styles.stepCard}>
      <Text style={styles.stepTitle}>📍 Location Information</Text>
      <Text style={styles.stepDescription}>
        Help others find you when they need blood
      </Text>

      {renderLocationSelector(
        "Division",
        divisions,
        form.divisionId,
        (value) => handleChange("divisionId", value),
        "Select Division",
        errors.divisionId
      )}

      {renderLocationSelector(
        "Zila",
        zilas,
        form.zilaId,
        (value) => handleChange("zilaId", value),
        "Select Zila",
        errors.zilaId
      )}

      {renderLocationSelector(
        "Upazila",
        upazilas,
        form.upazilaId,
        (value) => handleChange("upazilaId", value),
        "Select Upazila",
        errors.upazilaId
      )}

      <Input
        label="Village (Optional)"
        value={form.village}
        onChangeText={(value) => handleChange("village", value)}
        placeholder="Enter your village name"
      />

      <Input
        label="Current Location"
        value={form.currentLocation}
        onChangeText={(value) => handleChange("currentLocation", value)}
        placeholder="e.g., Near City Hospital, Main Road"
        required
        error={errors.currentLocation}
        helperText="This helps people find you easily"
      />
    </Card>
  );

  const renderStep4 = () => {
    const selectedDivision = divisions.find(d => d && d.id && d.id.toString() === form.divisionId);
    const selectedZila = zilas.find(z => z && z.id && z.id.toString() === form.zilaId);
    const selectedUpazila = upazilas.find(u => u && u.id && u.id.toString() === form.upazilaId);

    return (
      <Card style={styles.stepCard}>
        <Text style={styles.stepTitle}>✅ Review & Submit</Text>
        <Text style={styles.stepDescription}>
          Please review your information before submitting
        </Text>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Personal Information</Text>
          <Text style={styles.reviewItem}>Name: {form.firstName} {form.lastName}</Text>
          <Text style={styles.reviewItem}>Phone: {form.phoneNumber}</Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Blood & Health</Text>
          <Text style={styles.reviewItem}>Blood Group: {form.bloodGroup}</Text>
          <Text style={styles.reviewItem}>Last Donation: {form.lastDonationDate}</Text>
          {form.notes && <Text style={styles.reviewItem}>Notes: {form.notes}</Text>}
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Location</Text>
          <Text style={styles.reviewItem}>Division: {selectedDivision?.name}</Text>
          <Text style={styles.reviewItem}>Zila: {selectedZila?.name}</Text>
          <Text style={styles.reviewItem}>Upazila: {selectedUpazila?.name}</Text>
          {form.village && <Text style={styles.reviewItem}>Village: {form.village}</Text>}
          <Text style={styles.reviewItem}>Current Location: {form.currentLocation}</Text>
        </View>

        <View style={styles.availabilitySection}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Available for donation</Text>
            <Button
              title={form.isAvailable ? "Available ✅" : "Not Available ❌"}
              variant={form.isAvailable ? "safe" : "alert"}
              size="small"
              onPress={() => handleChange("isAvailable", !form.isAvailable)}
            />
          </View>
        </View>

        <View style={styles.consentSection}>
          <Button
            title={form.consent ? "✅ I give my consent" : "⬜ I give my consent"}
            variant={form.consent ? "safe" : "secondary"}
            onPress={() => handleChange("consent", !form.consent)}
            style={styles.consentButton}
          />
          <Text style={styles.consentText}>
            I consent to sharing my contact information with people who need blood donations.
            I understand that my information will be used responsibly to save lives.
          </Text>
          {errors.consent && <Text style={styles.errorText}>{errors.consent}</Text>}
        </View>
      </Card>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner
          variant="bloodDrop"
          text="Registering your account..."
          size="large"
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitles={stepTitles}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <Button
            title="Previous"
            variant="secondary"
            onPress={handlePrevious}
            style={styles.navButton}
          />
        )}

        <Button
          title={currentStep === totalSteps ? "Submit Registration" : "Next"}
          variant="primary"
          onPress={handleNext}
          style={currentStep === 1 ? styles.fullWidthButton : styles.navButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepCard: {
    marginVertical: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  bloodGroupSelector: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  locationScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  locationButton: {
    marginRight: 8,
    minWidth: 80,
  },
  reviewSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  reviewItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  availabilitySection: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  consentSection: {
    marginBottom: 20,
  },
  consentButton: {
    marginBottom: 12,
  },
  consentText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    textAlign: 'center',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  navButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
});

DonorRegistrationScreen.displayName = 'DonorRegistrationScreen';

export default DonorRegistrationScreen;