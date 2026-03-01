import { ListEntry } from "@/services/ListService";
import { Album } from "@/types";
import { SpotifyAlbum } from "@/types/spotifyTypes";



export function createNewListEntry(searchResult: SpotifyAlbum, listId: number, listLength: number): ListEntry {   
    const newListEntry: ListEntry = {
        id: "",
        list_id: listId,
        album: album,
        list_position: listLength
     }

    return newListEntry
};