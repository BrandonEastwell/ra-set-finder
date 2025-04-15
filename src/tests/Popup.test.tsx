import { screen, render, waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest';
import Tab = chrome.tabs.Tab;
import Popup from '../popup/Popup.tsx';
import React from "react";

describe('Popup component of chrome extension', () => {
  it('should not inject scraper script when URL does not match', async () => {
    const tab: Tab = {id: 123, url: "https://ra.co/artist/342"} as chrome.tabs.Tab;
    vi.spyOn(chrome.tabs, "query").mockResolvedValue([tab])
    const executeContentScriptMock = vi.spyOn(chrome.scripting, "executeScript")

    await waitFor(() => {
      render(<Popup />)
    })

    expect(executeContentScriptMock).not.toHaveBeenCalled();
  });

  it('should inject scraper script when URL matches', async () => {
    const tab: Tab = {id: 123, url: "https://ra.co/events/12314"} as chrome.tabs.Tab;
    vi.spyOn(chrome.tabs, "query").mockResolvedValue([tab])
    const executeContentScriptSpy = vi.spyOn(chrome.scripting, "executeScript")

    await waitFor(() => {
      render(<Popup />)
    })

    expect(executeContentScriptSpy).toHaveBeenCalled();
  });

  it('should set badge state to OFF when previous state is ON', async () => {
    const tab: Tab = {id: 123, url: "https://ra.co/events/23874"} as chrome.tabs.Tab;
    vi.spyOn(chrome.tabs, "query").mockResolvedValue([tab])
    const setBadgeSpy = vi.spyOn(chrome.action, "setBadgeText");
    vi.spyOn(chrome.action, "getBadgeText").mockResolvedValue("ON");

    await waitFor(() => {
      render(<Popup />)
    })

    expect(setBadgeSpy).toHaveBeenCalledWith({text: "OFF", tabId: tab.id})
  });
});