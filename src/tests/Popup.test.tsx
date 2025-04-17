import { screen, render, waitFor } from '@testing-library/react';
import { beforeAll, expect, vi } from 'vitest';
import Popup from '../popup/Popup.tsx';
import React from "react";
import * as session from '../lib/utils/localStorage.ts';

async function getActiveTabFromLocalStorageMock() {
  await chrome.storage.local.get(["ActiveTab"])
  return {isValidTab: true, tabId: 1, eventId: 12413};
}

async function getEventCacheFromLocalStorageMock() {
  await chrome.storage.local.get(["Events"])
  return {eventId: 1, Artists: []}
}

describe('Popup component of chrome extension', () => {
  beforeAll(() => {
    vi.spyOn(session, "getEventsCacheFromLocalStorage").mockImplementation(getEventCacheFromLocalStorageMock)
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockImplementation(getActiveTabFromLocalStorageMock)
  })

  it('should get tab state on component mount', async () => {
    const mock = vi.spyOn(chrome.storage.local, "get");
    render(<Popup />);

    await waitFor(() => {
      expect(mock).toHaveBeenCalledWith(["ActiveTab"])
    })
  });

  it('should show extension popup when URL matches', async () => {
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: true, tabId: 1, eventId: 234563 })
    render(<Popup />);

    await waitFor(() => {
      expect(screen.getByTestId("popup-matched")).toBeInTheDocument()
    })
  });

  it('should handle unrecognised tab by a tooltip popup', async () => {
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: false, tabId: 1, eventId: null })
    render(<Popup />);

    await waitFor(() => {
      expect(screen.getByTestId("popup-unmatched")).toBeInTheDocument()
    })
  });

  it('should not inject scraper script when URL does not match', async () => {
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: false, tabId: 1, eventId: null })
    const executeContentScriptMock = vi.spyOn(chrome.scripting, "executeScript");
    render(<Popup />);

    await waitFor(() => {
      expect(executeContentScriptMock).not.toHaveBeenCalled();
    })
  });

  it('should inject scraper script when URL matches', async () => {
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: true, tabId: 1, eventId: 13324 })
    vi.spyOn(session, "getEventsCacheFromLocalStorage").mockResolvedValue(null)
    const executeContentScriptSpy = vi.spyOn(chrome.scripting, "executeScript")
    render(<Popup />);

    await waitFor(() => {
      expect(executeContentScriptSpy).toHaveBeenCalled();
    })
  });
});