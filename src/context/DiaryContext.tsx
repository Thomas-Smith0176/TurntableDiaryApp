import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Album, DiaryEntry, List } from '../types';
import * as DiaryService from '../services/DiaryService';
import * as AlbumService from '../services/AlbumService';
import * as ListService from '../services/ListService';
import { TopArtist } from '@/types/topArtist';

interface DiaryContextType {
  entries: DiaryEntry[];
  albums: Album[];
  topRatedAlbums: Album[];
  topRatedArtists: TopArtist[];
  loadEntries: () => Promise<void>;
  loadAlbums: () => Promise<void>;
  loadLists: () => Promise<void>;
  loadTopRatedAlbums: () => Promise<void>;
  loadTopRatedArtists: () => Promise<void>;
  addEntry: (entry: any) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryById: (id: string) => DiaryEntry | undefined;
  getAllEntries: () => DiaryEntry[];
  averageRating: number;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [topRatedAlbums, setTopRatedAlbums] = useState<Album[]>([]);
  const [topRatedArtists, setTopRatedArtists] = useState<TopArtist[]>([]);

  const loadEntries = async () => {
    const diary = await DiaryService.getDiaryEntries();
    setEntries(diary);
  };

  const loadAlbums = async () => {
    const albums = await AlbumService.getUserAlbums();
    setAlbums(albums);
  }

  const loadLists = async () => {
    const lists = await ListService.getUserLists();
    setLists(lists);
  }

  const loadTopRatedAlbums = async () => {
    const albums = await AlbumService.getTopRatedAlbumsFromDiary();
    setTopRatedAlbums(albums.slice(0, 5));
  };

  const loadTopRatedArtists = async () => {
    const artists = await AlbumService.getTopRatedArtistsFromDiary();
    setTopRatedArtists(artists.slice(0, 5));
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const addEntry = async (entry: any) => {
    await DiaryService.saveDiaryEntry(entry);
    await loadEntries();
  };

  const updateEntry = async (id: string, entry: Partial<DiaryEntry>) => {
    await DiaryService.updateDiaryEntry(id, {
      rating: entry.rating,
      review: entry.review,
      date_listened: (entry as any).dateListen,
    } as any);
    await loadEntries();
  };

  const deleteEntry = async (id: string) => {
    await DiaryService.deleteDiaryEntry(id);
    await loadEntries();
  };

  const getEntryById = (id: string) => {
    return entries.find(e => e.id === id);
  };

  const getAllEntries = () => entries;

  const averageRating = useMemo(() => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((s, e) => s + (e.rating || 0), 0);
    return total / entries.length;
  }, [entries]);

  return (
    <DiaryContext.Provider
      value={{ 
      entries, 
      albums, 
      topRatedAlbums,
      topRatedArtists,
      loadEntries, 
      loadAlbums,
      loadLists,
      loadTopRatedAlbums, 
      loadTopRatedArtists, 
      getAllEntries, 
      addEntry, 
      updateEntry, 
      deleteEntry, 
      getEntryById, 
      averageRating}}
    >
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

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
