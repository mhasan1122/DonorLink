import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert, Platform } from 'react-native';
import { Card, Button, LoadingSpinner } from '../ui';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface DonationRecord {
  id: string;
  date: string;
  location: string;
  bloodType: string;
  amount: string;
  recipient?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

function DonationHistoryScreen() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    livesSaved: 0,
    lastDonation: '',
  });

  useEffect(() => {
    fetchDonationHistory();
  }, []);

  const fetchDonationHistory = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to fetch donation history
      await new Promise(resolve => setTimeout(resolve, 1000));

      // No dummy data - start with empty array
      const donations: DonationRecord[] = [];

      setDonations(donations);
      setStats({
        totalDonations: 0,
        totalAmount: 0,
        livesSaved: 0,
        lastDonation: '',
      });
    } catch (error) {
      console.error('Error fetching donation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'cancelled': return '#F44336';
      default: return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  const generatePDFReport = async () => {
    // Prevent multiple concurrent PDF generation requests
    if (isGeneratingPDF) {
      Alert.alert('Please wait', 'PDF is already being generated...');
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const currentDate = new Date().toLocaleDateString('en-GB');
      const currentTime = new Date().toLocaleTimeString('en-GB');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Blood Donation Report</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #D32F2F;
              padding-bottom: 20px;
            }
            .bismillah {
              font-size: 24px;
              font-weight: bold;
              color: #2E7D32;
              margin-bottom: 20px;
              font-family: 'Times New Roman', serif;
            }
            .title {
              color: #D32F2F;
              font-size: 28px;
              font-weight: bold;
              margin: 10px 0;
            }
            .subtitle {
              color: #666;
              font-size: 16px;
              margin-bottom: 10px;
            }
            .date-info {
              color: #888;
              font-size: 12px;
              margin-top: 10px;
            }
            .stats-section {
              background: linear-gradient(135deg, #ffebee 0%, #f3e5f5 100%);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
              border-left: 5px solid #D32F2F;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-top: 15px;
            }
            .stat-item {
              text-align: center;
              background: white;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #D32F2F;
              display: block;
            }
            .stat-label {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            .donations-section {
              margin: 30px 0;
            }
            .section-title {
              color: #D32F2F;
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 15px;
              border-bottom: 2px solid #D32F2F;
              padding-bottom: 5px;
            }
            .donation-item {
              background: white;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 10px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .donation-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 10px;
            }
            .donation-date {
              font-weight: bold;
              color: #333;
              font-size: 16px;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 12px;
              color: white;
              font-size: 10px;
              font-weight: bold;
            }
            .status-completed { background-color: #4CAF50; }
            .status-pending { background-color: #FFC107; }
            .status-cancelled { background-color: #F44336; }
            .donation-details {
              color: #666;
              font-size: 14px;
              margin: 5px 0;
            }
            .empty-state {
              text-align: center;
              padding: 40px;
              background: #f9f9f9;
              border-radius: 10px;
              color: #666;
              font-style: italic;
            }
            .footer {
              margin-top: 40px;
              padding: 20px;
              background: linear-gradient(135deg, #e8f5e8 0%, #f0f4ff 100%);
              border-radius: 10px;
              text-align: center;
              border: 2px solid #4CAF50;
            }
            .footer-message {
              color: #2E7D32;
              font-size: 16px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .footer-quote {
              color: #666;
              font-style: italic;
              font-size: 14px;
              margin-bottom: 15px;
            }
            .footer-signature {
              color: #D32F2F;
              font-weight: bold;
              font-size: 14px;
            }
            .heart-icon {
              color: #D32F2F;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="bismillah">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
            <div class="title">🩸 Blood Donation Report</div>
            <div class="subtitle">LifeDonor - Saving Lives Together</div>
            <div class="date-info">Generated on ${currentDate} at ${currentTime}</div>
          </div>

          <div class="stats-section">
            <h3 style="margin-top: 0; color: #D32F2F;">📊 Donation Statistics</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">${stats.totalDonations}</span>
                <div class="stat-label">Total Donations</div>
              </div>
              <div class="stat-item">
                <span class="stat-number">${stats.totalAmount}ml</span>
                <div class="stat-label">Blood Donated</div>
              </div>
              <div class="stat-item">
                <span class="stat-number">${stats.livesSaved}</span>
                <div class="stat-label">Lives Saved</div>
              </div>
            </div>
          </div>

          <div class="donations-section">
            <h3 class="section-title">📋 Donation History</h3>
            ${donations.length > 0 ?
              donations.map(donation => `
                <div class="donation-item">
                  <div class="donation-header">
                    <span class="donation-date">${new Date(donation.date).toLocaleDateString('en-GB')}</span>
                    <span class="status-badge status-${donation.status}">
                      ${getStatusIcon(donation.status)} ${donation.status.toUpperCase()}
                    </span>
                  </div>
                  <div class="donation-details">📍 ${donation.location}</div>
                  <div class="donation-details">🩸 ${donation.bloodType} • ${donation.amount}</div>
                  ${donation.recipient ? `<div class="donation-details">👤 For: ${donation.recipient}</div>` : ''}
                </div>
              `).join('')
              :
              `<div class="empty-state">
                <div style="font-size: 48px; margin-bottom: 15px;">🩸</div>
                <div>No donation history found.</div>
                <div>Start your journey as a life-saver today!</div>
              </div>`
            }
          </div>

          <div class="footer">
            <div class="footer-message">
              <span class="heart-icon">❤️</span> Thank you for being a hero! <span class="heart-icon">❤️</span>
            </div>
            <div class="footer-quote">
              "The best people are those who benefit others." - Prophet Muhammad (PBUH)
            </div>
            <div class="footer-quote">
              Every drop of blood you donate can save up to 3 lives.<br>
              Your generosity makes you a true hero in someone's story.
            </div>
            <div class="footer-signature">
              With gratitude,<br>
              <strong>LifeDonor Team</strong>
            </div>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Add a small delay to ensure the PDF is fully generated
      await new Promise(resolve => setTimeout(resolve, 500));

      if (Platform.OS === 'web') {
        // For web, open the print dialog (user can save as PDF)
        await Print.printAsync({ html: htmlContent });
        Alert.alert('Tip', 'Use the print dialog to save as PDF.');
      } else {
        // For mobile platforms, use sharing which acts as download
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'your blood donation history',
            UTI: 'com.adobe.pdf',
          });
          Alert.alert('Success', 'PDF downloaded successfully!');
        } else {
          Alert.alert('Error', 'Download not available on this device.');
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (error instanceof Error && error.message && error.message.includes('Another share request')) {
        Alert.alert('Please wait', 'Another sharing operation is in progress. Please try again in a moment.');
      } else {
        Alert.alert('Error', 'Failed to generate PDF report. Please try again.');
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderDonationItem = ({ item }: { item: DonationRecord }) => (
    <Card style={styles.donationCard}>
      <View style={styles.donationHeader}>
        <Text style={styles.donationDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>
            {getStatusIcon(item.status)} {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.donationLocation}>📍 {item.location}</Text>
      <Text style={styles.donationDetails}>🩸 {item.bloodType} • {item.amount}</Text>
      
      {item.recipient && (
        <Text style={styles.donationRecipient}>👤 For: {item.recipient}</Text>
      )}
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner
          variant="bloodDrop"
          text="Loading donation history..."
          size="large"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Donation Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalDonations}</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalAmount}ml</Text>
            <Text style={styles.statLabel}>Blood Donated</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.livesSaved}</Text>
            <Text style={styles.statLabel}>Lives Saved</Text>
          </View>
        </View>
      </Card>

      <View style={styles.historyHeader}>
        <Text style={styles.sectionTitle}>Donation History</Text>
        <Button
          title={isGeneratingPDF ? "⏳ Downloading..." : "📥 Download Report"}
          variant="secondary"
          size="small"
          onPress={generatePDFReport}
          disabled={isGeneratingPDF}
        />
      </View>

      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={renderDonationItem}
        scrollEnabled={false}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              🩸 No donation history found.{'\n'}
              Start your journey as a life-saver today!
            </Text>
          </Card>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  donationCard: {
    marginBottom: 12,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  donationDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  donationLocation: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  donationDetails: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  donationRecipient: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

DonationHistoryScreen.displayName = 'DonationHistoryScreen';

export default DonationHistoryScreen;
