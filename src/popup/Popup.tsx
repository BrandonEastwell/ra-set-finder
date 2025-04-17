import React, { useEffect, useRef, useState } from 'react';
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';
import { getActiveTabFromLocalStorage, getEventsCacheFromLocalStorage } from '../lib/utils/localStorage.ts';
import { ActiveTab, EventsCache, EventsCacheItem } from '../lib/types/objects.ts';
import { urlToEventId } from '../lib/utils/helpers.ts';

function Popup() {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const artistsRef = useRef<string[] | null>(null);
  const activeTabRef = useRef<ActiveTab | null>(null);

  useEffect(() => {
    async function loadPopupData() {
      // Checks active tab for validity
      const activeTab = await getActiveTabFromLocalStorage();

      if (!activeTab?.isValidTab || !activeTab.eventId) {
        setHasError(true);
        setIsReady(true);
        return;
      }

      activeTabRef.current = activeTab;

      // Find artists in cache or scrape active tab
      const cached = await getEventsCacheFromLocalStorage(activeTab.eventId);
      if (cached) {
        artistsRef.current = cached.Artists;
      } else {
        await scrapeArtistsFromDOM(activeTab.tabId); // Inject content scraper script
      }

      setIsReady(true)
    }

    loadPopupData()
  }, []);

  // Listen for message from scraper script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => receiveMessage(message, sender, sendResponse));
  async function receiveMessage(message: any, sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) {
    if (message.type === "ARTISTS") {
      const tabUrl = sender.tab?.url;
      const eventsCache: EventsCache = await chrome.storage.local.get(["Events"]); // Retrieve tab data cache
      if (tabUrl) {
        const eventId = urlToEventId(tabUrl);
        // If events cache exists, add new entry
        if (eventsCache.Events) {
          const cachedEventFound: boolean = eventsCache.Events.some((item) => item.eventId === Number(eventId))
          if (cachedEventFound) return
          eventsCache.Events.push({ eventId: Number(eventId), Artists: message.payload });
          await chrome.storage.local.set({ Events: eventsCache.Events });
        } else {
          // Create events cache
          await chrome.storage.local.set({ Events: [{ eventId: Number(eventId), Artists: message.payload }] })
        }
        artistsRef.current = message.payload;
        console.log(artistsRef.current)
      }
    }
  }

  if (!activeTabRef.current || !activeTabRef.current.isValidTab) {
    return (
      <div data-testid="popup-unmatched" className="flex flex-col w-[360px] h-[100px] shadow overflow-auto">
        <p>This extension does not work on this page.</p>
        <p>Set Finder only works on <a href="http://ra.co/events">resident advisor</a> event pages.</p>
      </div>
    );
  } else {
    return (
      <div data-testid="popup-matched" className="flex flex-col border w-[360px] h-[600px] shadow overflow-auto">
        {artistsRef.current && artistsRef.current.map((artist) => (<p>{artist}</p>))}
      </div>
    );
  }
}

export default Popup;
