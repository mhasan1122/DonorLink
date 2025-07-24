import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

function HealthCheckScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then(res => res.json())
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