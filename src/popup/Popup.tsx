import React, { useEffect, useState } from 'react';
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';
import { getActiveTabFromLocalStorage, getEventsCacheFromLocalStorage } from '../lib/utils/localStorage.ts';
import { ActiveTab, Artist, EventsCache, EventsCacheItem } from '../lib/types/objects.ts';
import { urlToEventId } from '../lib/utils/helpers.ts';
import ArtistList from '../lib/components/ArtistList.tsx';

function Popup() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab | null>(null);
  const [artists, setArtists] = useState<Artist[] | null>(null);

  useEffect(() => {
    async function loadPopupData() {
      // Checks active tab for validity
      const tabData = await getActiveTabFromLocalStorage();
      if (!tabData || !tabData.isValidTab || !tabData.eventId) {
        console.log("Tab is not valid or missing event ID:", tabData);
        setHasError(true);
        setIsLoaded(true);
        return;
      }

      setActiveTab(tabData);

      // Find artists in cache or scrape active tab
      const eventCache = await getEventsCacheFromLocalStorage(tabData.eventId);
      if (eventCache) {
        setArtists(eventCache.artists)
      } else {
        await scrapeArtistsFromDOM(tabData.tabId); // Inject content scraper script
      }

      setIsLoaded(true);
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
      const eventsCache: EventsCache = await chrome.storage.local.get(['events']); // Retrieve events data cache
      if (tabUrl) {
        const eventId = urlToEventId(tabUrl);
        const artists: Artist[] = message.payload.map((name: string) => ({ name: name, sets: null }));
        const event: EventsCacheItem = { eventId: Number(eventId), artists: artists };

        // Create events cache
        if (!eventsCache.events) {
          await chrome.storage.local.set({ events: [event] });
          setArtists(artists)
          return;
        }

        // Check if event is found in cache
        const cachedEventFound: boolean = eventsCache.events.some(item => item.eventId === Number(eventId));
        if (cachedEventFound) return;

        // Push new event to cache
        eventsCache.events.push(event);
        await chrome.storage.local.set({ events: eventsCache.events });
        setArtists(artists)
      }
    }
  }

  // TODO: Split into components
  // TODO: Connect Youtube API, use artists to query sets
  // TODO: Main button that sends a fetch request to YT API
  // TODO: Cache results to display as history

  return (
    <div
      className="flex flex-col font-gothic border-1 border-[#121212] min-w-[450px] max-h-[600px] overflow-hidden">
      <div className="flex flex-col px-6 py-4 min-h-[200px] bg-[#121212]">
        <h1 className="mb-2 text-6xl text-purered">RA SET FINDER</h1>
        <div className="flex flex-col gap-2">
          {(!activeTab || !activeTab.isValidTab) ? (
            <div className="flex flex-col gap-2" data-testid="popup-unmatched">
              <p className="text-slatewhite text-3xl">This extension does not work on this page.</p>
              <p className="text-slatewhite text-3xl">Set Finder only works on <a href="http://ra.co/events">resident advisor</a> event pages.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2" data-testid="popup-matched">
              <p className="text-slatewhite text-3xl">Discover live sets for every DJ on the lineup</p>
              {artists && <p className="text-slatewhite text-3xl">Sets found! Discover now</p>}
            </div>
          )}
        </div>
      </div>
      {activeTab && activeTab.isValidTab && activeTab.eventId && artists && (
        <ArtistList artists={artists} eventId={activeTab.eventId} />
      )}
    </div>
  );
}

export default Popup;
