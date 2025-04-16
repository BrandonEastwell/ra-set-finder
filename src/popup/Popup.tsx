import React, { useEffect, useState } from 'react';
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';
import { getActiveTabFromLocalStorage, getEventCacheFromLocalStorage } from '../lib/utils/localStorage.ts';
import { EventsCache, EventsCacheItem } from '../lib/types/events.ts';

function Popup() {
  const [artists, setArtists] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<{ isValidTab: boolean, tabId: number | null } | null>(null);

  useEffect(() => {
    async function checkIsValidTab() {
      const currentTab = await getActiveTabFromLocalStorage();
      setActiveTab(currentTab);
    }
    // Check active tab for validity
    checkIsValidTab()
  },[])

  // Find artists in cache or scrape active tab
  if (activeTab && activeTab.isValidTab && activeTab.tabId) {
    let isTabCached = false;
    getEventCacheFromLocalStorage(activeTab.tabId).then(res => {
      if (res) {
        res.eventId === activeTab.tabId ? setArtists(res.Artists) : null
        isTabCached = true;
      }
    });
    // Inject content scraper script
    !isTabCached ? scrapeArtistsFromDOM(activeTab.tabId) : null;
  }

  // Listen for message from scraper script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => receiveMessage(message, sender, sendResponse));
  async function receiveMessage(message: any, sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) {
    if (message.type === "ARTISTS") {
      const tabUrl = sender.tab?.url;
      const eventsCache: EventsCache = await chrome.storage.local.get(["Events"]); // Retrieve tab data cache
      if (tabUrl) {
        const splitUrl = tabUrl.split("/");
        const eventId = splitUrl[splitUrl.length - 1];
        // If events cache exists, add new entry
        if (eventsCache.Events) {
          const cachedEventFound: EventsCacheItem | undefined = eventsCache.Events.find((item) => item.eventId === sender.tab?.id)
          eventsCache.Events.push({ eventId: parseInt(eventId), Artists: message.payload });
          await chrome.storage.local.set({ Events: eventsCache.Events });
        } else {
          // Create events cache
          await chrome.storage.local.set({Events: [{ eventId: parseInt(eventId), Artists: message.payload }]})
        }
        setArtists(message.payload);
      }
    }
  }

  if (!activeTab || !activeTab.isValidTab) {
    return (
      <div data-testid="popup-unmatched" className="flex flex-col w-[360px] h-[100px] shadow overflow-auto">
        <p>This extension does not work on this page.</p>
        <p>Set Finder only works on <a href="http://ra.co/events">resident advisor</a> event pages.</p>
      </div>
    );
  } else {
    return (
      <div data-testid="popup-matched" className="flex flex-col border w-[360px] h-[600px] shadow overflow-auto">
        {artists.map((artist) => (<p>{artist}</p>))}
      </div>
    );
  }
}

export default Popup;
