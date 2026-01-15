import { Album, DiaryEntry } from '../types';

// Mock data service - replace with real API calls or local storage
class AlbumService {
  private diaryEntries: DiaryEntry[] = [];

  // Add a new album entry to diary
  addEntry(entry: DiaryEntry): void {
    this.diaryEntries.push(entry);
  }

  // Get all diary entries
  getAllEntries(): DiaryEntry[] {
    return this.diaryEntries;
  }

  // Get entry by ID
  getEntryById(id: string): DiaryEntry | undefined {
    return this.diaryEntries.find(entry => entry.id === id);
  }

  // Update an entry
  updateEntry(id: string, updatedEntry: Partial<DiaryEntry>): void {
    const index = this.diaryEntries.findIndex(entry => entry.id === id);
    if (index !== -1) {
      this.diaryEntries[index] = { ...this.diaryEntries[index], ...updatedEntry };
    }
  }

  // Delete an entry
  deleteEntry(id: string): void {
    this.diaryEntries = this.diaryEntries.filter(entry => entry.id !== id);
  }

  // Get average rating for all albums
  getAverageRating(): number {
    if (this.diaryEntries.length === 0) return 0;
    const totalRating = this.diaryEntries.reduce((sum, entry) => sum + entry.rating, 0);
    return totalRating / this.diaryEntries.length;
  }

  // Get entries sorted by date
  getEntriesByDate(): DiaryEntry[] {
    return [...this.diaryEntries].sort((a, b) => 
      new Date(b.dateListen).getTime() - new Date(a.dateListen).getTime()
    );
  }

  // Get entries by rating
  getEntriesByRating(minRating: number): DiaryEntry[] {
    return this.diaryEntries.filter(entry => entry.rating >= minRating);
  }
}

export default new AlbumService();
