import React, { useState } from 'react';
import { 
  View, Text, Button, StyleSheet, ScrollView,
  SafeAreaView, TouchableOpacity, Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('Ready');

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!result.canceled) {
        const newFile = result.assets[0].name;
        if (files.includes(newFile)) {
          setStatus('⚠️ Already added');
        } else {
          setFiles(prev => [...prev, newFile]);
          setStatus('✅ Added: ' + newFile);
        }
      }
    } catch (err) {
      setStatus('❌ Error');
      Alert.alert('Error', 'Could not pick document');
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setStatus('🗑️ File removed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Document Agent</Text>
        <Text style={styles.subtitle}>{files.length} file(s) selected</Text>
      </View>

      <Text style={styles.status}>{status}</Text>

      <ScrollView style={styles.content}>
        {files.length === 0
          ? <Text style={styles.empty}>No files selected yet.</Text>
          : files.map((f, i) => (
            <View key={i} style={styles.fileRow}>
              <Text style={styles.fileName} numberOfLines={1}>📄 {f}</Text>
              <TouchableOpacity onPress={() => removeFile(i)}>
                <Text style={styles.removeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </ScrollView>

      <View style={styles.footer}>
        <Button title="+ Pick Document" onPress={pickFile} color="#2c3e50" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#f9f9f9' },
  header:      { backgroundColor: '#2c3e50', padding: 20, paddingTop: 50 },
  title:       { color: 'white', fontSize: 24, fontWeight: 'bold' },
  subtitle:    { color: '#bdc3c7', fontSize: 13, marginTop: 4 },
  status:      { padding: 10, paddingHorizontal: 20, color: '#555', fontSize: 13 },
  content:     { flex: 1, paddingHorizontal: 20 },
  empty:       { color: '#aaa', marginTop: 20, textAlign: 'center' },
  fileRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: '#fff', padding: 12, marginVertical: 5, borderRadius: 8,
                  shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  fileName:    { flex: 1, fontSize: 14, color: '#2c3e50' },
  removeBtn:   { color: '#e74c3c', fontSize: 16, paddingLeft: 10 },
  footer:      { padding: 20 },
});
