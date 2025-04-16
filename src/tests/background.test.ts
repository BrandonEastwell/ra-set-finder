import { expect } from 'vitest';
import * as background from '../service-workers/background.ts';


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

  it('should store tab state as true when URL is matched', async () => {
    vi.mocked(chrome.tabs.get).mockResolvedValue({ url: "https://ra.co/events/2123" } as chrome.tabs.Tab)
    await background.updateActiveTabStatus(1);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ ActiveTab: { isValidTab: true, tabId: 1 } })
  });

  it('should store tab state as false when URL is not matched', async () => {
    vi.mocked(chrome.tabs.get).mockResolvedValue({ url: "https://ra.co/artists/435" } as chrome.tabs.Tab)
    await background.updateActiveTabStatus(1);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ ActiveTab: { isValidTab: false, tabId: 1 } })
  });

  it('should store tab state as false when URL is not found', async () => {
    vi.mocked(chrome.tabs.get).mockResolvedValue({} as chrome.tabs.Tab)
    await background.updateActiveTabStatus(1);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({ ActiveTab: { isValidTab: false, tabId: 1 } })
  });
});