import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { HomePageItem } from '../../types';

interface HomePageItemCardProps {
    item: HomePageItem
    onPress: () => void;
}

export const HomePageItemCard = ({ item, onPress }: HomePageItemCardProps) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8e8e8'
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  }
});
