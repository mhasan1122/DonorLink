import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, LoadingSpinner, SearchBar, FilterModal } from "./ui";
import DonorCard from "./ui/DonorCard";
import { API_ENDPOINTS, apiRequest } from "../config/api";

interface Donor {
  id: number;
  firstName: string;
  lastName: string;
  bloodGroup: string;
  divisionId: number;
  zilaId: number;
  upazilaId: number;
  phoneNumber: string;
  lastDonationDate: string;
  isAvailable: boolean;
}

function DonorListScreen() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    bloodGroups: [] as string[],
    divisionId: "",
    zilaId: "",
    upazilaId: "",
    availableOnly: false,
    lastDonationWithin: 365,
  });
  const navigation = useNavigation();

  useEffect(() => {
    fetchDonors();
  }, [filters]);

  useEffect(() => {
    if (searchQuery.length > 2 || searchQuery.length === 0) {
      fetchDonors();
    }
  }, [searchQuery]);

  const fetchDonors = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    // Build query parameters
    const params = new URLSearchParams();

    // Add search query
    if (searchQuery) params.append('search', searchQuery);

    // Add blood group filters
    if (filters.bloodGroups.length > 0) {
      params.append('bloodGroup', filters.bloodGroups.join(','));
    }

    // Add location filters
    if (filters.divisionId) params.append('divisionId', filters.divisionId);
    if (filters.zilaId) params.append('zilaId', filters.zilaId);
    if (filters.upazilaId) params.append('upazilaId', filters.upazilaId);

    // Add availability filter
    if (filters.availableOnly) params.append('available', 'true');

    // Add last donation filter
    if (filters.lastDonationWithin < 365) {
      params.append('lastDonationWithin', filters.lastDonationWithin.toString());
    }

    const url = `${API_ENDPOINTS.DONORS}?${params.toString()}`;

    try {
      const data = await apiRequest(url);
      setDonors(data);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setDonors([]);
    }

    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    fetchDonors(true);
  };

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>🔍</Text>
      <Text style={styles.emptyStateTitle}>No donors found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search criteria or filters
      </Text>
      <Button
        title="Clear Filters"
        variant="secondary"
        onPress={() => {
          setFilters({
            bloodGroups: [],
            divisionId: "",
            zilaId: "",
            upazilaId: "",
            availableOnly: false,
            lastDonationWithin: 365,
          });
          setSearchQuery("");
        }}
        style={styles.clearFiltersButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setShowFilterModal(true)}
        showFilterBadge={getActiveFilterCount() > 0}
        filterCount={getActiveFilterCount()}
        placeholder="Search by name, location, blood group..."
      />

      <View style={styles.headerActions}>
        <Button
          title="📝 Become a Donor"
          variant="primary"
          onPress={() => navigation.navigate("Register" as never)}
          style={styles.registerButton}
        />
      </View>

      {loading && !refreshing ? (
        <LoadingSpinner
          variant="bloodDrop"
          text="Finding donors..."
          size="large"
        />
      ) : (
        <FlatList
          data={donors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DonorCard
              donor={item}
              onPress={() => navigation.navigate("DonorDetail" as never, { id: item.id } as never)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#D32F2F']}
              tintColor="#D32F2F"
            />
          }
          ListEmptyComponent={!loading ? renderEmptyState : null}
          contentContainerStyle={donors.length === 0 ? styles.emptyContainer : undefined}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  registerButton: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  clearFiltersButton: {
    paddingHorizontal: 32,
  },
});

DonorListScreen.displayName = 'DonorListScreen';

export default DonorListScreen;