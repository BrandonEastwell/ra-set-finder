import React, { useState } from 'react';
import { EventsCache, SetVideo } from '../types/objects.ts';

const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : "http://localhost:4000";

export default function ArtistCard({
  artist,
  sets,
  eventId,
}: {
  artist: string;
  sets: SetVideo[] | null;
  eventId: number;
}) {
  const [artistSets, setArtistSets] = useState<SetVideo[] | null>(sets);

  async function getSearchResults() {
    const url = new URL(`${API_URL}/search`)
    url.searchParams.set("artist", artist);
    const res = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }

    const data = await res.json();
    const sets: SetVideo[] = data.results;
    return sets;
  }

  async function getSetsList() {
    // Retrieve events data cache
    const cache: EventsCache = await chrome.storage.local.get(['events']);
    const eventsCache = cache.events;

    // Check if event is found in cache
    const cachedEventIndex: number = eventsCache.findIndex(item => item.eventId === Number(eventId));
    if (cachedEventIndex === -1) return;

    const event = eventsCache[cachedEventIndex];
    const cachedArtistIndex: number = event.artists.findIndex(item => item.name === artist);
    if (cachedArtistIndex === -1) return;

    const artistData = event.artists[cachedArtistIndex];

    // If sets found in cache, use it
    if (artistData.sets) return setArtistSets(artistData.sets);

    // No artist sets found in cache, fetch new sets
    try {
      const sets = await getSearchResults();
      // Update cache
      artistData.sets = sets;
      await chrome.storage.local.set({ events: eventsCache });
      setArtistSets(sets);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col border-b-1 border-t-1 border-slatewhite/10">
      <div key={artist} className="flex flex-row py-4 cursor-pointer">
        <p onClick={() => getSetsList()} className="text-slatewhite text-4xl hover:text-purered">
          {artist}
        </p>
      </div>
      {artistSets && artistSets.map(set => <p>{set.title}</p>)}
    </div>
  );
}
