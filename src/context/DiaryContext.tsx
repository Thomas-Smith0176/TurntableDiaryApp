import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Album, DiaryEntry, List } from '../types';
import * as DiaryService from '../services/DiaryService';
import * as AlbumService from '../services/AlbumService';
import * as ListService from '../services/ListService';
import { TopArtist } from '@/types/topArtist';
import { useFocusEffect } from '@react-navigation/native';

interface DiaryContextType {
  entries: DiaryEntry[];
  albums: Album[];
  lists: List[];
  topRatedAlbums: Album[];
  topRatedArtists: TopArtist[];
  loadEntries: () => Promise<void>;
  getAllEntries: () => DiaryEntry[];
  getEntryById: (id: string) => DiaryEntry | undefined;
  addEntry: (entry: any) => Promise<void>;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  loadAlbums: () => Promise<void>;
  loadLists: () => Promise<void>;
  getAllLists: () => List[];
  loadTopRatedAlbums: () => Promise<void>;
  loadTopRatedArtists: () => Promise<void>;
  averageRating: number;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [topRatedAlbums, setTopRatedAlbums] = useState<Album[]>([]);
  const [topRatedArtists, setTopRatedArtists] = useState<TopArtist[]>([]);

  // Diary
  const loadEntries = async () => {
    const diary = await DiaryService.getDiaryEntries();
    setEntries(diary);
  };

  const getEntryById = (id: string) => {
    return entries.find(e => e.id === id);
  };

  const getAllEntries = () => entries;

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

  const loadAlbums = async () => {
    const albums = await AlbumService.getUserAlbums();
    setAlbums(albums);
  }


  // Lists
  const loadLists = async () => {
    const lists = await ListService.getUserLists();
    setLists(lists);
  };

  const getAllLists = () => lists;


  // Profile
  const loadTopRatedAlbums = async () => {
    const albums = await AlbumService.getTopRatedAlbumsFromDiary();
    setTopRatedAlbums(albums.slice(0, 5));
  };

  const loadTopRatedArtists = async () => {
    const artists = await AlbumService.getTopRatedArtistsFromDiary();
    setTopRatedArtists(artists.slice(0, 5));
  };

  const averageRating = useMemo(() => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((s, e) => s + (e.rating || 0), 0);
    return total / entries.length;
  }, [entries]);

  useEffect(() => {
      loadEntries();
      loadLists();
  }, [])

  return (
    <DiaryContext.Provider
      value={{ 
      entries, 
      albums, 
      topRatedAlbums,
      topRatedArtists,
      lists,
      loadEntries, 
      getAllEntries,
      getEntryById, 
      addEntry, 
      updateEntry, 
      deleteEntry, 
      loadAlbums,
      loadLists,
      getAllLists, 
      loadTopRatedAlbums, 
      loadTopRatedArtists, 
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

