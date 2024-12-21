import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { WebView } from "react-native-webview";

export default function App() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }: any) => {
    setScanned(true);
    if (data.startsWith("http://") || data.startsWith("https://")) {
      setScannedUrl(data);
    } else {
      Alert.alert("Invalid URL", `Scanned data: ${data}`);
      setScanned(false); 
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (scannedUrl) {
    return (
      <View style={{ flex: 1 }}>
        <WebView source={{ uri: scannedUrl }} style={{ flex: 1 }} />
        <Button title="Back to Scanner" onPress={() => setScannedUrl(null)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
