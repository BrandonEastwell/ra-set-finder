import '@testing-library/jest-dom';

global.chrome = {
  tabs: {
    query: vi.fn(),
    onActivated: {
      addListener: vi.fn()
    },
    onUpdated: {
      addListener: vi.fn()
    },
    get: vi.fn()
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn()
    }
  },
  runtime: {
    onInstalled: {
      addListener: vi.fn()
    },
    onMessage: {
      addListener: vi.fn()
    },
    sendMessage: vi.fn()
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