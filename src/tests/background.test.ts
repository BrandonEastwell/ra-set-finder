import { expect } from 'vitest';
import * as background from '../background/background.ts';
import Tab = chrome.tabs.Tab;

describe('Background service worker that executes chrome extension events', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should not inject script when URL is not a match', async () => {
    const tab: Tab = {id: 123, url: "https://ra.co/artist/342"} as chrome.tabs.Tab;
    const executeContentScriptMock = vi.spyOn(chrome.scripting, "executeScript")
    await background.clickHandler(tab);
    expect(executeContentScriptMock).not.toHaveBeenCalled();
  });

  it('should inject script when URL matches and state is OFF', async () => {
    const tab: Tab = {id: 123, url: "https://ra.co/events"} as chrome.tabs.Tab;
    vi.spyOn(chrome.action, "getBadgeText").mockResolvedValue("OFF");
    const executeContentScriptSpy = vi.spyOn(chrome.scripting, "executeScript")

    await background.clickHandler(tab);
    expect(executeContentScriptSpy).toHaveBeenCalled();
  });

  it('should set badge state to OFF when previous state is ON', async () => {
    const tab: Tab = {id: 123, url: "https://ra.co/events/23874"} as chrome.tabs.Tab;
    const setBadgeSpy = vi.spyOn(chrome.action, "setBadgeText");
    vi.spyOn(chrome.action, "getBadgeText").mockResolvedValue("ON");

    await background.clickHandler(tab);
    expect(setBadgeSpy).toHaveBeenCalledWith({text: "OFF", tabId: tab.id})
  });

  it('should not inject a script if state is set to OFF', async () => {
    const executeScriptMock = vi.spyOn(chrome.scripting, "executeScript").mockResolvedValue()
    await background.executeContentScript("OFF", 123);
    expect(executeScriptMock).not.toHaveBeenCalled();
  });

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