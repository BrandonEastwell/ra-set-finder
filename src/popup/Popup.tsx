import React, { useState } from 'react';
import { setBadgeState } from '../lib/utils/badge.ts';
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';

async function onPopupOpen() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const urlMatcher = "https://ra.co/events"
  if (tab.id && tab.url?.startsWith(urlMatcher)) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const newState = prevState === "ON" ? "OFF" : "ON";

    await setBadgeState(newState, tab.id);
    await scrapeArtistsFromDOM(tab.id);
  }
}

function Popup() {
  const [artists, setArtists] = useState<string[]>([]);
  onPopupOpen();

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

export default Popup;
