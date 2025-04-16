import { screen, render, waitFor } from '@testing-library/react';
import { beforeAll, expect, vi } from 'vitest';
import Popup from '../popup/Popup.tsx';
import React from "react";
import * as session from '../lib/utils/localStorage.ts';

async function getActiveTabFromLocalStorageMock() {
  await chrome.storage.local.get(["ActiveTab"])
  return {isValidTab: true, tabId: 1};
}

async function getTabCacheFromLocalStorageMock() {
  await chrome.storage.local.get(["Tabs"])
  return {tabId: 1, Artists: []}
}

describe('Popup component of chrome extension', () => {
  beforeAll(() => {
    vi.spyOn(session, "getTabCacheFromLocalStorage").mockImplementation(getTabCacheFromLocalStorageMock)
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
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: true, tabId: 1 })
    render(<Popup />);

    await waitFor(() => {
      expect(screen.getByTestId("popup-matched")).toBeInTheDocument()
    })
  });

  it('should handle unrecognised tab by a tooltip popup', async () => {
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: false, tabId: 1 })
    render(<Popup />);

    await waitFor(() => {
      expect(screen.getByTestId("popup-unmatched")).toBeInTheDocument()
    })
  });

  it('should not inject scraper script when URL does not match', async () => {
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: false, tabId: 1 })
    const executeContentScriptMock = vi.spyOn(chrome.scripting, "executeScript");
    render(<Popup />);

    await waitFor(() => {
      expect(executeContentScriptMock).not.toHaveBeenCalled();
    })
  });

  it('should inject scraper script when URL matches', async () => {
    vi.spyOn(session, "getActiveTabFromLocalStorage").mockResolvedValue({ isValidTab: true, tabId: 1 })
    const executeContentScriptSpy = vi.spyOn(chrome.scripting, "executeScript")
    render(<Popup />);

    await waitFor(() => {
      expect(executeContentScriptSpy).toHaveBeenCalled();
    })
  });
});