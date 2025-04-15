import '@testing-library/jest-dom';

global.chrome = {
  tabs: {
    query: vi.fn(),
  },
  runtime: {
    onInstalled: {
      addListener: vi.fn()
    },
    onMessage: {
      addListener: vi.fn()
    }
  },
  action: {
    onClicked: {
      addListener: vi.fn()
    },
    setBadgeText: vi.fn(),
    getBadgeText: vi.fn()
  },
  scripting: {
    executeScript: vi.fn()
  }
} as unknown as typeof chrome