import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, SafeAreaView, BackHandler } from 'react-native';
import { useState, useRef, useEffect } from 'react';

export default function App() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const CORRECT_PASSWORD = '123';

  // Force hide the status bar and block the back button
  useEffect(() => {
    const backAction = () => {
      // If unlocked, allow them to go back. If locked, block it completely.
      if (unlocked) {
        return false;
      }
      return true; // true blocks the default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [unlocked]);

  const handleUnlock = () => {
    if (password === CORRECT_PASSWORD) {
      setUnlocked(true);
    } else {
      setPassword('');
      triggerShake();
    }
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  if (unlocked) {
    return (
      <View style={styles.unlockedContainer}>
        <StatusBar style="light" hidden={false} />
        <Text style={styles.successIcon}>🔓</Text>
        <Text style={styles.successText}>Access Granted!</Text>
        <Text style={styles.secretData}>Here is your secret content.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.lockBox, { transform: [{ translateX: shakeAnimation }] }]}>
          <Text style={styles.title}>Enter Password</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleUnlock}
            autoFocus={true}
            keyboardType="default"
          />

          <TouchableOpacity style={styles.button} onPress={handleUnlock} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Unlock</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pitch black
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBox: {
    width: '85%',
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unlockedContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  secretData: {
    color: '#aaaaaa',
    fontSize: 16,
  }
});
