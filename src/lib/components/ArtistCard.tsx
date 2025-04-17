import React, { useState } from 'react';
import { SetVideo } from '../types/objects.ts';

const apiKey = import.meta.env.VITE_API_KEY
const apiUrl = import.meta.env.VITE_API_URL

export default function ArtistCard({ artist, sets, eventId } : { artist: string, sets: SetVideo[] | null, eventId: number }) {
  const [artistSets, setArtistSets] = useState<SetVideo[] | null>(sets)

  async function getSearchResults(artist: string) {
    const query = artist + " dj set"
    const url = new URL(`${apiUrl}/search`);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("maxResults", "5");
    url.searchParams.set("type", "video");
    url.searchParams.set("videoDuration", "long");
    url.searchParams.set("key", apiKey)

    const res = await fetch(url.toString(), {
      method: "GET",
    })

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }

    const data = await res.json();
    const sets: SetVideo[] = data.items.map((item: any) =>
      ({title: item.snippet.title, videoId: item.id.videoId, thumbnail: item.snippet.thumbnails.default.url}))
    setArtistSets(sets);
  }

  return (
    <div className="flex flex-col border-b-1 border-t-1 border-slatewhite/10">
      <div key={artist} className="flex flex-row py-4 cursor-pointer">
        <p onClick={() => getSearchResults(artist)} className="text-slatewhite text-4xl hover:text-purered">{artist}</p>
      </div>
      {artistSets && artistSets.map((set) => (
        <p>{set.title}</p>
      ))}
    </div>

  )
}