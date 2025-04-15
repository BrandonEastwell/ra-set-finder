import { expect } from 'vitest';
import * as background from '../service-workers/background.ts';
import Tab = chrome.tabs.Tab;
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';

describe('Background service worker that executes chrome extension events', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should set badge state to OFF', async () => {
    const setBadgeMock = vi.spyOn(chrome.action, "setBadgeText").mockResolvedValue()
    await background.setBadgeState("OFF");
    expect(setBadgeMock).toHaveBeenCalledWith({text: "OFF"});
  });

  it('should set badge state to ON', async () => {
    const setBadgeMock = vi.spyOn(chrome.action, "setBadgeText").mockResolvedValue()
    await background.setBadgeState("ON");
    expect(setBadgeMock).toHaveBeenCalledWith({text: "ON"});
  });
});