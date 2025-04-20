interface EventsCache {
  events: EventsCacheItem[];
}
interface EventsCacheItem {
  eventId: number;
  artists: Artist[];
}

interface Artist {
  name: string;
  sets: SetVideo[] | null;
}

interface ActiveTab {
  isValidTab: boolean;
  tabId: number;
  eventId: number | null;
}

interface SetVideo {
  title: string;
  videoId: string;
  thumbnail: string;
}

export { EventsCache, EventsCacheItem, ActiveTab, SetVideo, Artist };
