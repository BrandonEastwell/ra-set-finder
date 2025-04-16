import React, { useEffect, useState } from 'react';
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';
import { getActiveTabFromLocalStorage, getTabCacheFromLocalStorage } from '../lib/utils/localStorage.ts';

interface TabsCache { Tabs: TabsCacheItem[] }
interface TabsCacheItem { tabId: number, Artists: string[] }

function Popup() {
  const [artists, setArtists] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<{ isValidTab: boolean, tabId: number | null } | null>(null);

  useEffect(() => {
    async function checkIsValidTab() {
      const currentTab = await getActiveTabFromLocalStorage();
      setActiveTab((prevState) => {
        const prevStrState = JSON.stringify(prevState);
        const currStrState = JSON.stringify(currentTab);
        return prevStrState !== currStrState ? currentTab : prevState;
      });
    }
    // Check active tab for validity
    checkIsValidTab()
  },[])

  // Find artists in cache or scrape active tab
  if (activeTab && activeTab.isValidTab && activeTab.tabId) {
    let isTabCached = false;
    getTabCacheFromLocalStorage(activeTab.tabId).then(res => {
      if (res) {
        res.tabId === activeTab.tabId ? setArtists(res.Artists) : null
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
      const tabId = sender.tab?.id;
      const tabsCache: TabsCache = await chrome.storage.local.get(["Tabs"]); // Retrieve tab data cache
      if (tabId) {
        // If tab cache exists, add new entry
        if (tabsCache.Tabs) {
          const cachedTabFound: TabsCacheItem | undefined = tabsCache.Tabs.find((item) => item.tabId === sender.tab?.id)
          tabsCache.Tabs.push({ tabId: tabId, Artists: message.payload });
          await chrome.storage.local.set({ Tabs: tabsCache.Tabs });
        } else {
          // Create tabs cache
          await chrome.storage.local.set({Tabs: [{ tabId: sender.tab?.id, Artists: message.payload }]})
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
