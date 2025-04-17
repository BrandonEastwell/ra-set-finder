import React, { useEffect, useRef, useState } from 'react';
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';
import { getActiveTabFromLocalStorage, getEventsCacheFromLocalStorage } from '../lib/utils/localStorage.ts';
import { ActiveTab, EventsCache } from '../lib/types/objects.ts';
import { urlToEventId } from '../lib/utils/helpers.ts';
import ArtistList from '../lib/components/ArtistList.tsx';

function Popup() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const artistsRef = useRef<string[] | null>(null);
  const activeTabRef = useRef<ActiveTab | null>(null);

  useEffect(() => {
    async function loadPopupData() {
      // Checks active tab for validity
      const activeTab = await getActiveTabFromLocalStorage();

      if (!activeTab?.isValidTab || !activeTab.eventId) {
        setHasError(true);
        setIsLoaded(true);
        return;
      }

      activeTabRef.current = activeTab;

      // Find artists in cache or scrape active tab
      const cached = await getEventsCacheFromLocalStorage(activeTab.eventId);
      if (cached) {
        artistsRef.current = cached.Artists;
        setIsLoaded(true);
      } else {
        await scrapeArtistsFromDOM(activeTab.tabId); // Inject content scraper script
      }
    }

    loadPopupData();
  }, []);

  // Listen for message from scraper script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
    receiveMessage(message, sender, sendResponse),
  );

  // TODO: Move receiveMessage function to an external messaging service
  async function receiveMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: any) => void,
  ) {
    if (message.type === 'ARTISTS') {
      const tabUrl = sender.tab?.url;
      const eventsCache: EventsCache = await chrome.storage.local.get(['Events']); // Retrieve tab data cache
      if (tabUrl) {
        const eventId = urlToEventId(tabUrl);
        // If events cache exists, add new entry
        if (eventsCache.Events) {
          const cachedEventFound: boolean = eventsCache.Events.some(item => item.eventId === Number(eventId));
          if (cachedEventFound) return;
          eventsCache.Events.push({ eventId: Number(eventId), Artists: message.payload });
          await chrome.storage.local.set({ Events: eventsCache.Events });
        } else {
          // Create events cache
          await chrome.storage.local.set({ Events: [{ eventId: Number(eventId), Artists: message.payload }] });
        }
        artistsRef.current = message.payload;
        setIsLoaded(true);
      }
    }
  }

  // TODO: Split into components
  // TODO: Connect Youtube API, use artists to query sets
  // TODO: Main button that sends a fetch request to YT API
  // TODO: Cache results to display as history

  if (!activeTabRef.current || !activeTabRef.current.isValidTab) {
    return (
      <div data-testid="popup-unmatched" className="flex flex-col w-[360px] h-[100px] shadow overflow-auto">
        <p>This extension does not work on this page.</p>
        <p>
          Set Finder only works on <a href="http://ra.co/events">resident advisor</a> event pages.
        </p>
      </div>
    );
  } else {
    return (
      <div
        data-testid="popup-matched"
        className="flex flex-col font-gothic border-1 border-[#121212] min-w-[450px] max-h-[600px] overflow-hidden">
        <div className="flex flex-col px-6 py-4 min-h-[200px] bg-[#121212]">
          <h1 className="mb-2 text-6xl text-purered">RA SET FINDER</h1>
          <div className="flex flex-col gap-2">
            <p className="text-slatewhite text-3xl">Discover live sets for every DJ on the lineup</p>
            <p className="text-slatewhite text-3xl">Click to Discover</p>
          </div>
        </div>
        <ArtistList artists={artistsRef.current} />
      </div>
    );
  }
}

export default Popup;
