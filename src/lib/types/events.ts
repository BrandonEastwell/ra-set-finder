interface EventsCache { Events: EventsCacheItem[] }
interface EventsCacheItem { eventId: number, Artists: string[] }

export {EventsCache, EventsCacheItem}