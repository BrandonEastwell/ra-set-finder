import React from 'react';
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

export default function DiscoverSetsBtn({ artist }: { artist: string | null }) {
  function handleButtonClick() {}

  return (
    <button
      onClick={handleButtonClick}
      className="p-2 bg-purered text-slatewhite text-3xl rounded-full w-[175px] h-[175px]">
      DISCOVER
    </button>
  );
}
