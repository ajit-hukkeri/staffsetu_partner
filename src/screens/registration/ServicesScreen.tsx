// src/screens/registration/ServicesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  SectionList, // We'll use a SectionList for categories
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRegistration } from '../../context/RegistrationContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Make sure this path is correct

// Define the shape of our data
type Service = {
  id: string;
  name: string;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

// This is the shape for our SectionList
type SectionData = {
  title: string;
  data: Service[];
};

export default function ServicesScreen({ navigation }: any) {
  const { formData, setFormData } = useRegistration();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(formData.skills);

  // Fetch all categories and services from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch all categories
        const categoriesQuery = query(collection(db, 'categories'));
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const categories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];

        // 2. Fetch all services
        const servicesQuery = query(collection(db, 'services'));
        const servicesSnapshot = await getDocs(servicesQuery);
        const services = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Service[];

        // 3. Group services under their categories
        const groupedData = categories.map(category => ({
          title: category.name,
          data: services.filter(s => s.categoryId === category.id),
        }));

        setSections(groupedData);
      } catch (error) {
        console.error("Error fetching services:", error);
        Alert.alert('Error', 'Could not load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle logic for selecting a skill
  const handleToggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      // De-select the skill
      setSelectedSkills(prev => prev.filter(id => id !== skillId));
    } else {
      // Select the skill, but check the 3-skill limit
      if (selectedSkills.length >= 3) {
        Alert.alert('Limit Reached', 'You can only select a maximum of 3 skills.');
      } else {
        setSelectedSkills(prev => [...prev, skillId]);
      }
    }
  };

  const handleNext = () => {
    if (selectedSkills.length === 0) {
      Alert.alert('No Skills Selected', 'Please select at least one skill.');
      return;
    }

    // Save to context and navigate
    setFormData(prevData => ({
      ...prevData,
      skills: selectedSkills,
    }));
    
    navigation.navigate('Vehicle');
    
  };

  const renderService = ({ item }: { item: Service }) => {
    const isSelected = selectedSkills.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.skillItem, isSelected && styles.skillItemSelected]}
        onPress={() => handleToggleSkill(item.id)}
      >
        <Text style={[styles.skillText, isSelected && styles.skillTextSelected]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step 5: Select Your Skills (Max 3)</Text>
      <Text style={styles.subtitle}>
        Choose the services you are most skilled at.
      </Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderService}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
          )}
          style={styles.list}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button 
          title={`Next (${selectedSkills.length} / 3 selected)`} 
          onPress={handleNext} 
          disabled={selectedSkills.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  list: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skillItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 20,
  },
  skillItemSelected: {
    backgroundColor: '#e0eaff',
  },
  skillText: {
    fontSize: 16,
  },
  skillTextSelected: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});