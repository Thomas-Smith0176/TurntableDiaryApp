import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Album, DiaryEntry } from '../types';
import * as DiaryService from '../services/DiaryService';
import * as AlbumService from '../services/AlbumService';

interface DiaryContextType {
  entries: DiaryEntry[];
  albums: Album[];
  loadEntries: () => Promise<void>;
  loadAlbums: () => Promise<void>;
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

  const loadEntries = async () => {
    const list = await DiaryService.getDiaryEntries();
    setEntries(list);
  };

  const loadAlbums = async () => {
    const list = await AlbumService.getUserAlbums();
    setAlbums(list);
  }

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
      value={{ entries, albums, loadEntries, loadAlbums, getAllEntries, addEntry, updateEntry, deleteEntry, getEntryById, averageRating }}
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
