import React, { useState } from 'react';
import ArtistCard from './ArtistCard.tsx';
import { Artist } from '../types/objects.ts';

export default function ArtistList({ artists, eventId } : { artists: Artist[], eventId: number }) {
  const [toggleList, setToggleList] = useState<boolean>(false)

  return (
    <div className="flex flex-col max-h-[400px] bg-black px-6 py-4 pb-0">
      <p onClick={() => setToggleList((prevState) => !prevState)} className="text-slatewhite text-4xl cursor-pointer mb-4">Sets</p>
      {toggleList && artists && <div className="overflow-y-scroll">
        {artists.map((artist) => (
          <ArtistCard artist={artist.name} sets={artist.sets} />
        ))}
      </div>}
    </div>
  )
}