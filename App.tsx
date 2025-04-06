import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

interface InvestorProfile {
  age: string;
  income: string;
  risk: string;
}

export default function App() {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<InvestorProfile>({
    age: '',
    income: '',
    risk: 'moderate',
  });

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post('http://localhost:3000/api/ask', {
        question,
        profile,
      });

      setResponse(res.data.answer || 'No response received.');
    } catch (error) {
      setResponse('⚠️ Error: Unable to connect to AI assistant.');
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 GenAI Financial Assistant</Text>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>👤 Your Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={profile.age}
          onChangeText={(age) => setProfile({ ...profile, age })}
        />
        <TextInput
          style={styles.input}
          placeholder="Monthly Income (INR)"
          keyboardType="numeric"
          value={profile.income}
          onChangeText={(income) => setProfile({ ...profile, income })}
        />
        <TextInput
          style={styles.input}
          placeholder="Risk Tolerance (low, moderate, high)"
          value={profile.risk}
          onChangeText={(risk) => setProfile({ ...profile, risk })}
        />
      </View>

      <Text style={styles.sectionTitle}>💬 Ask a Question</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. What is SIP?"
        value={question}
        onChangeText={setQuestion}
      />

      <TouchableOpacity style={styles.button} onPress={handleAsk} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Thinking...' : 'Ask'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0066cc" style={{ marginTop: 20 }} />}

      {response && (
        <View style={styles.responseBox}>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f8fa' },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#003366' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  responseBox: {
    backgroundColor: '#e0f2ff',
    padding: 16,
    marginTop: 20,
    borderRadius: 12,
  },
  responseText: { fontSize: 16, lineHeight: 24, color: '#003366' },
  profileSection: { marginBottom: 10 },
});
