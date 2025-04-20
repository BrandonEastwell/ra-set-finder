import Popup from '../popup/Popup.tsx';
import React from 'react';
import * as session from '../lib/utils/localStorage.ts';
import { render, waitFor, screen } from '@testing-library/react';

async function getActiveTabFromLocalStorageMock() {
  await chrome.storage.local.get(['activeTab']);
  return { isValidTab: true, tabId: 1, eventId: 12413 };
}

async function getEventCacheFromLocalStorageMock() {
  await chrome.storage.local.get(['events']);
  return { eventId: 1, artists: [] };
}

describe('Popup component of chrome extension', () => {
  beforeAll(() => {
    vi.spyOn(session, 'getEventsCacheFromLocalStorage').mockImplementation(getEventCacheFromLocalStorageMock);
    vi.spyOn(session, 'getActiveTabFromLocalStorage').mockImplementation(getActiveTabFromLocalStorageMock);
  });

  it('should get tab state on component mount', async () => {
    const mock = vi.spyOn(chrome.storage.local, 'get');
    render(<Popup />);

    await waitFor(() => {
      expect(mock).toHaveBeenCalledWith(['activeTab']);
    });
  });

  it('should show popup matched component when URL matches', async () => {
    vi.spyOn(session, 'getActiveTabFromLocalStorage').mockResolvedValue({
      isValidTab: true,
      tabId: 1,
      eventId: 234563,
    });
    render(<Popup />);

    await waitFor(() => {
      expect(screen.getByTestId('popup-matched')).toBeInTheDocument();
    });
  });

  it('should show popup unmatched component when URL is unrecognised', async () => {
    vi.spyOn(session, 'getActiveTabFromLocalStorage').mockResolvedValue({ isValidTab: false, tabId: 1, eventId: null });
    render(<Popup />);

    await waitFor(() => {
      expect(screen.getByTestId('popup-unmatched')).toBeInTheDocument();
    });
  });

  it('should not inject scraper script when URL does not match', async () => {
    vi.spyOn(session, 'getActiveTabFromLocalStorage').mockResolvedValue({ isValidTab: false, tabId: 1, eventId: null });
    const executeContentScriptMock = vi.spyOn(chrome.scripting, 'executeScript');
    render(<Popup />);

    await waitFor(() => {
      expect(executeContentScriptMock).not.toHaveBeenCalled();
    });
  });

  it('should inject scraper script when URL matches', async () => {
    vi.spyOn(session, 'getActiveTabFromLocalStorage').mockResolvedValue({ isValidTab: true, tabId: 1, eventId: 13324 });
    vi.spyOn(session, 'getEventsCacheFromLocalStorage').mockResolvedValue(null);
    const executeContentScriptSpy = vi.spyOn(chrome.scripting, 'executeScript');
    render(<Popup />);

    await waitFor(() => {
      expect(executeContentScriptSpy).toHaveBeenCalled();
    });
  });
});
