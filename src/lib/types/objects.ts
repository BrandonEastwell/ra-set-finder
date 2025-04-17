interface EventsCache { Events: EventsCacheItem[] }
interface EventsCacheItem { eventId: number, Artists: string[] }
interface ActiveTab { isValidTab: boolean, tabId: number, eventId: number | null }

export {EventsCache, EventsCacheItem, ActiveTab}