import React, { useState } from 'react';
import ArtistCard from './ArtistCard.tsx';
import { Artist } from '../types/objects.ts';

export default function ArtistList({ artists, eventId }: { artists: Artist[]; eventId: number }) {
  const [toggleList, setToggleList] = useState<boolean>(false);

  return (
    <div className="flex flex-col max-h-[400px] bg-black pb-0">
      <div className="flex flex-row items-center cursor-pointer hover:bg-purered/10 px-6 py-4"
           onClick={() => setToggleList(prevState => !prevState)}>
        <svg className={`w-[24px] group-hover:fill-purered transition-transform duration-100 ${toggleList ? 'rotate-90' : '-rotate-90'}`}
             xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
        <p className="text-slatewhite text-4xl cursor-pointer">
          Sets
        </p>
      </div>
      { toggleList && artists && (
        <div className="overflow-y-scroll px-6 py-4">
          {artists.map(artist => (
            <ArtistCard artist={artist.name} sets={artist.sets} eventId={eventId} />
          ))}
        </div>
      )}
    </div>
  );
}
