import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { apiRequest, API_ENDPOINTS } from "../config/api";

function HealthCheckScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest(API_ENDPOINTS.HEALTH)
      .then(data => setStatus(data.status))
      .catch(() => setStatus("error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {loading ? <ActivityIndicator /> : <Text>Status: {status}</Text>}
    </View>
  );
}

HealthCheckScreen.displayName = 'HealthCheckScreen';

export default HealthCheckScreen;