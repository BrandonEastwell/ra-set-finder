// Global condition to stop multiple injections
const artists = findArtistNamesFromDOM();
sendArtistsToPopup(artists);

async function sendArtistsToPopup(artists: string[]) {
  await chrome.runtime.sendMessage({ type: 'ARTISTS', payload: artists });
}

function findArtistNamesFromDOM() {
  const artists: string[] = [];
  const lineupSection = document.querySelector('div[data-tracking-id="event-detail-lineup"]');
  if (!lineupSection) return artists;
  const artistSpans = lineupSection.querySelectorAll('a > span');
  artistSpans.forEach(span => {
    if (span && typeof span.textContent === 'string') {
      artists.push(span.textContent);
    }
  });
  return artists;
}

export { findArtistNamesFromDOM };
