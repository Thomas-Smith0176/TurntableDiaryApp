import { useDiary } from "@/context/DiaryContext";
import { DiaryEntry } from "@/types";
import { useMemo } from "react";

export const useSectionedDiary = (query: string) => {
    const { getAllEntries } = useDiary();
    const entries = getAllEntries();

    return useMemo(() => {
        const filteredEntries = entries.filter(entry => {
            const titleMatch = entry.album.title.toLowerCase().includes(query.toLowerCase());
            const artistMatch = entry.album.artist.toLowerCase().includes(query.toLowerCase());
            return titleMatch || artistMatch;
        });
    
        const sortedEntries = [...filteredEntries].sort((a, b) => 
            new Date(b.dateListen).getTime() - new Date(a.dateListen).getTime()
        );
    
        const sections: { title: string; data: DiaryEntry[] }[] = [];
    
        sortedEntries.forEach((entry) => {
            const date = new Date(entry.dateListen);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
            const lastSection = sections[sections.length - 1];
    
            if (!lastSection || lastSection.title !== monthYear) {
                sections.push({ title: monthYear, data: [entry] });
            } else {
                lastSection.data.push(entry);
            }
        });
    
        return sections;
    }, [entries, query])
};