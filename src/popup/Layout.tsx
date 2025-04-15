import React, { useState } from 'react';

function Layout() {
  const [artists, setArtists] = useState<string[]>([]);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => receiveMessage(message, sender, sendResponse));

  function receiveMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
    if (message.type === "ARTISTS") {
      // Do something with artists
      setArtists(message.payload);
    }
  }

  return (
    <div className="flex flex-col border w-[360px] h-[600px] shadow overflow-auto">
      {artists.map((artist) => (<p>{artist}</p>))}
    </div>
  );
}

export default Layout;
