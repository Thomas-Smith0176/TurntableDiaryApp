import { DiaryEntry } from "@/types";
import { FlatList,  Text, View, StyleSheet } from "react-native";
import { UISimplifiedDiaryEntry } from "./UIDiaryEntry";

interface UISimplifiedDiaryProps {
    diaryEntries: DiaryEntry[];
    onPress: (item: DiaryEntry) => void
}

export const UISimplifiedDiary: React.FC<UISimplifiedDiaryProps> = ({diaryEntries, onPress}) => {
    return (
        <View style={styles.diaryContainer}>
          {diaryEntries.length > 0 ? (
            <FlatList
              data={diaryEntries}
              keyExtractor={(item: DiaryEntry) => item.id}
              renderItem={({item}) => (
                  <UISimplifiedDiaryEntry
                  entry={item}
                  onPress={() => onPress(item)}
                  />
                )
              }
              scrollEnabled={true}
              nestedScrollEnabled={true}
              style={{ flex: 1 }}
              contentContainerStyle={styles.diaryListContent}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.emptyText}>You have no diary entries!</Text>
            </View>
          )}
        </View>  
    );
};

const styles = StyleSheet.create({
  diaryContainer: {
      flex: 1,
      backgroundColor: '#fff',
      marginTop: 10
  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  diaryListContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
  },
  emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      justifyContent: 'center'
  },
})