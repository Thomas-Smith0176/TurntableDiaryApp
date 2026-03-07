import { DiaryEntry } from "@/types";
import { Image, FlatList,  SectionList, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import { UIDiaryEntry, UISimplifiedDiaryEntry } from "./UIDiaryEntry";

interface UIAlbumDiaryProps {
    diarySections: {
        title: string;
        data: DiaryEntry[];
    }[],
    onPress: (item: DiaryEntry) => void
}

export const UIAlbumDiary: React.FC<UIAlbumDiaryProps> = ({diarySections, onPress}) => {
    return (
        <SectionList
            sections={diarySections}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <UIDiaryEntry
                entry={item}
                onPress={() => onPress(item)}
                />
            )}
            renderSectionHeader={({section: {title}}) => (
                <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
                <View style={styles.sectionSeparator} />
                </View>
            )}
            stickySectionHeadersEnabled={true}
            contentContainerStyle={styles.listContent}
        />
    )
};

const styles = StyleSheet.create({  

    listContent: {
        paddingVertical: 8,
    },
    sectionHeader: {
        backgroundColor: '#f9f9f9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginRight: 10,
    },
    sectionSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
        marginTop: 2,
    },
    icon: {
        width: 20,
        height: 20,
        opacity: 0.4,
    },
});