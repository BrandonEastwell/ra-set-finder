import React, { useState } from 'react';

const apiKey = import.meta.env.VITE_API_KEY
const apiUrl = import.meta.env.VITE_API_URL

export default function ArtistCard({artist} : {artist: string}) {
  const [artistSets, setArtistSets] = useState(null)

  async function getSearchResults(artist: string) {
    const query = artist + " dj set"
    const url = new URL(`${apiUrl}/search`);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("maxResults", "5");
    url.searchParams.set("type", "video");
    url.searchParams.set("videoDuration", "long");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }})

    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }

    return await res.json();
  }

  return (
    <div className="flex flex-col py-4 border-b-1 border-t-1 border-slatewhite">
      <div key={artist} className="flex flex-row">
        <p onClick={() => getSearchResults(artist)} className="text-slatewhite text-4xl cursor-pointer hover:text-purered">{artist}</p>
      </div>
      {artistSets && (
        <></>
      )}
    </div>

  )
}