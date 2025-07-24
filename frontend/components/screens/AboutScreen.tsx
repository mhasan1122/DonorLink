import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Card, Button } from '../ui';

function AboutScreen() {
  const handleEmergencyCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleWebsiteOpen = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroEmoji}>🩸</Text>
          <Text style={styles.heroTitle}>LifeDonor</Text>
          <Text style={styles.heroSubtitle}>Connecting Blood Donors & Recipients</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </Card>

      <Card style={styles.missionCard}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.missionText}>
          LifeDonor is dedicated to saving lives by connecting blood donors with those in need. 
          Our platform makes it easy to find nearby donors and register as a life-saving donor.
        </Text>
      </Card>

      <Card style={styles.emergencyCard}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <Text style={styles.emergencySubtitle}>24/7 Blood Emergency Hotlines</Text>
        
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
        
        <Button
          title="📞 Dhaka Medical: 01819-211-595"
          variant="accent"
          onPress={() => handleEmergencyCall('01819211595')}
          style={styles.emergencyButton}
        />
      </Card>

      <Card style={styles.resourcesCard}>
        <Text style={styles.sectionTitle}>Resources</Text>
        
        <Button
          title="🌐 Blood Donation Guidelines"
          variant="secondary"
          onPress={() => handleWebsiteOpen('https://www.who.int/campaigns/world-blood-donor-day')}
          style={styles.resourceButton}
        />
        
        <Button
          title="📋 Eligibility Criteria"
          variant="secondary"
          onPress={() => {}}
          style={styles.resourceButton}
        />
        
        <Button
          title="🏥 Find Blood Banks"
          variant="secondary"
          onPress={() => {}}
          style={styles.resourceButton}
        />
      </Card>

      <Card style={styles.contactCard}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.contactText}>
          📧 Email: support@lifedonor.app{'\n'}
          📱 Phone: +880-1234-567890{'\n'}
          🌐 Website: www.lifedonor.app
        </Text>
        
        <Button
          title="Send Feedback"
          variant="accent"
          onPress={() => Linking.openURL('mailto:support@lifedonor.app')}
          style={styles.contactButton}
        />
      </Card>

      <Card style={styles.legalCard}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <Button
          title="Privacy Policy"
          variant="secondary"
          onPress={() => {}}
          style={styles.legalButton}
        />
        <Button
          title="Terms of Service"
          variant="secondary"
          onPress={() => {}}
          style={styles.legalButton}
        />
        <Button
          title="Data Usage Policy"
          variant="secondary"
          onPress={() => {}}
          style={styles.legalButton}
        />
      </Card>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made with ❤️ for saving lives{'\n'}
          © 2024 LifeDonor. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  heroCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: '#999999',
  },
  missionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  emergencyCard: {
    marginBottom: 16,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
    marginBottom: 12,
  },
  emergencyButton: {
    marginBottom: 8,
  },
  resourcesCard: {
    marginBottom: 16,
  },
  resourceButton: {
    marginBottom: 8,
  },
  contactCard: {
    marginBottom: 16,
  },
  contactText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  contactButton: {
    marginTop: 8,
  },
  legalCard: {
    marginBottom: 16,
  },
  legalButton: {
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 16,
  },
});

AboutScreen.displayName = 'AboutScreen';

export default AboutScreen;
