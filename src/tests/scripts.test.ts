import { expect, vi } from 'vitest';
import { scrapeArtistsFromDOM } from '../lib/utils/scripts.ts';

describe('Tests script execution', () => {
  it('should inject a script', async () => {
    const executeScriptMock = vi.spyOn(chrome.scripting, "executeScript").mockResolvedValue()
    await scrapeArtistsFromDOM(123);
    expect(executeScriptMock).toHaveBeenCalled();
  });
});