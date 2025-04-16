interface TabsCacheItem { tabId: number, Artists: string[] }
interface TabsCache { Tabs: TabsCacheItem[] }

async function getActiveTabFromLocalStorage() {
  const res = await chrome.storage.local.get(["ActiveTab"])
  return res.ActiveTab.isValidTab ? { isValidTab: res.ActiveTab.isValidTab, tabId: res.ActiveTab.tabId } : null;
}

async function getTabCacheFromLocalStorage(tabId: number) {
  const res: TabsCache = await chrome.storage.local.get(["Tabs"])
  if (res.Tabs) {
    const cachedTabFound: TabsCacheItem | undefined = res.Tabs.find((item: { tabId: number; }) => item.tabId === tabId)
    return cachedTabFound ? cachedTabFound : null;
  }
  return null
}

export { getActiveTabFromLocalStorage, getTabCacheFromLocalStorage}