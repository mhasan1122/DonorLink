import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Card, Button, Input } from '../ui';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How often can I donate blood?',
      answer: 'You can donate whole blood every 8 weeks (56 days). This allows your body enough time to replenish the donated blood cells.',
      category: 'Donation'
    },
    {
      id: '2',
      question: 'What are the eligibility criteria for blood donation?',
      answer: 'You must be 18-65 years old, weigh at least 50kg, be in good health, and not have donated blood in the last 56 days.',
      category: 'Eligibility'
    },
    {
      id: '3',
      question: 'How do I update my availability status?',
      answer: 'Go to your profile and tap "Update Availability". You can toggle your availability on/off based on your health and schedule.',
      category: 'App Usage'
    },
    {
      id: '4',
      question: 'Is my personal information safe?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your data. You can control what information is visible to others in Privacy Settings.',
      category: 'Privacy'
    },
    {
      id: '5',
      question: 'How do I get notified about blood requests?',
      answer: 'Enable notifications in your settings. You\'ll receive alerts when someone needs your blood type in your area.',
      category: 'Notifications'
    }
  ];

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback before sending.');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Thank You!',
        'Your feedback has been sent successfully. We appreciate your input!',
        [{ text: 'OK' }]
      );
      setFeedbackText('');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to send feedback. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleEmergencyCall = (number: string) => {
    Alert.alert(
      'Emergency Call',
      `Do you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL(`tel:${number}`) }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>🚨 Emergency Contacts</Text>
        <Text style={styles.emergencySubtitle}>For urgent blood requirements</Text>
        
        <Button
          title="📞 National Blood Service: 999"
          variant="alert"
          onPress={() => handleEmergencyCall('999')}
          style={styles.emergencyButton}
        />
        
        <Button
          title="📞 Red Crescent: 01713-398-398"
          variant="primary"
          onPress={() => handleEmergencyCall('01713398398')}
          style={styles.emergencyButton}
        />
      </Card>

      <Card style={styles.contactCard}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        
        <Button
          title="📧 Email Support"
          variant="secondary"
          onPress={() => Linking.openURL('mailto:mirzahasanlimon619@gmail.com')}
          style={styles.contactButton}
        />
        
        <Button
          title="📱 Call Support: +880-1234-567890"
          variant="secondary"
          onPress={() => handleEmergencyCall('+8801234567890')}
          style={styles.contactButton}
        />
        
        <Button
          title="💬 Live Chat"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              'Live Chat',
              'Live chat feature will be available soon. Please use email or phone for now.',
              [{ text: 'OK' }]
            );
          }}
          style={styles.contactButton}
        />
      </Card>

      <Card style={styles.faqCard}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {faqs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <Button
              title={`❓ ${faq.question}`}
              variant="secondary"
              onPress={() => toggleFAQ(faq.id)}
              style={styles.faqQuestion}
            />
            {expandedFAQ === faq.id && (
              <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </Card>

      <Card style={styles.resourcesCard}>
        <Text style={styles.sectionTitle}>Helpful Resources</Text>
        
        <Button
          title="🌐 Blood Donation Guidelines"
          variant="secondary"
          onPress={() => Linking.openURL('https://www.who.int/campaigns/world-blood-donor-day')}
          style={styles.resourceButton}
        />
        
        <Button
          title="📋 Eligibility Checker"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              'Eligibility Checker',
              'This feature will be available in a future update.',
              [{ text: 'OK' }]
            );
          }}
          style={styles.resourceButton}
        />
        
        <Button
          title="🏥 Find Blood Banks"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              'Blood Bank Locator',
              'This feature will be available in a future update.',
              [{ text: 'OK' }]
            );
          }}
          style={styles.resourceButton}
        />
      </Card>

      <Card style={styles.feedbackCard}>
        <Text style={styles.sectionTitle}>Send Feedback</Text>
        <Text style={styles.feedbackDescription}>
          Help us improve the app by sharing your thoughts and suggestions.
        </Text>
        
        <Input
          label="Your Feedback"
          value={feedbackText}
          onChangeText={setFeedbackText}
          placeholder="Tell us what you think..."
          multiline
          numberOfLines={4}
          style={styles.feedbackInput}
        />
        
        <Button
          title="Send Feedback"
          variant="primary"
          onPress={handleSendFeedback}
          loading={loading}
          style={styles.sendButton}
        />
      </Card>

      <Card style={styles.appInfoCard}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Updated:</Text>
          <Text style={styles.infoValue}>December 2024</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Developer:</Text>
          <Text style={styles.infoValue}>DonorLink Team</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  emergencyCard: {
    marginBottom: 16,
    backgroundColor: '#FFF3E0',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  emergencyButton: {
    marginBottom: 8,
  },
  contactCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  contactButton: {
    marginBottom: 8,
  },
  faqCard: {
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 8,
  },
  faqQuestion: {
    marginBottom: 0,
  },
  faqAnswer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  resourcesCard: {
    marginBottom: 16,
  },
  resourceButton: {
    marginBottom: 8,
  },
  feedbackCard: {
    marginBottom: 16,
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  feedbackInput: {
    marginBottom: 16,
  },
  sendButton: {
    marginBottom: 8,
  },
  appInfoCard: {
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
});

HelpSupportScreen.displayName = 'HelpSupportScreen';

export default HelpSupportScreen;
