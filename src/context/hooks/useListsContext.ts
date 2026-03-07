import { useDiary } from "@/context/DiaryContext";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";

export const useListsContext = (query: string) => {
    const { getAllLists, loadLists } = useDiary();
    const lists = getAllLists();

    useFocusEffect(
        useCallback(() => {
            loadLists(); 
        }, [loadLists])
    );

    return useMemo(() => {
        const filteredLists = lists.filter(list => {
            const titleMatch = list.title.toLowerCase().includes(query.toLowerCase());
            return titleMatch
        });
    
        const sortedLists = [...filteredLists].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    
        return sortedLists;
    }, [lists, query])
};