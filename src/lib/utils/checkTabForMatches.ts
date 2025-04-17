export default async function checkTabForMatches() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const urlMatcher = 'https://ra.co/events';
  return !!(tab.id && tab.url?.startsWith(urlMatcher));
}
