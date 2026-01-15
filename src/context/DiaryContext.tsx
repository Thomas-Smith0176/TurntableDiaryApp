import React, { createContext, useContext, useState } from 'react';
import { DiaryEntry } from '../types';
import AlbumService from '../services/AlbumService';

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: DiaryEntry) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => DiaryEntry | undefined;
  averageRating: number;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const addEntry = (entry: DiaryEntry) => {
    AlbumService.addEntry(entry);
    setEntries([...AlbumService.getAllEntries()]);
  };

  const updateEntry = (id: string, entry: Partial<DiaryEntry>) => {
    AlbumService.updateEntry(id, entry);
    setEntries([...AlbumService.getAllEntries()]);
  };

  const deleteEntry = (id: string) => {
    AlbumService.deleteEntry(id);
    setEntries([...AlbumService.getAllEntries()]);
  };

  const getEntryById = (id: string) => {
    return AlbumService.getEntryById(id);
  };

  const averageRating = AlbumService.getAverageRating();

  return (
    <DiaryContext.Provider
      value={{ entries, addEntry, updateEntry, deleteEntry, getEntryById, averageRating }}
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
