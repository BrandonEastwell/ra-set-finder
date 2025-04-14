import '@testing-library/jest-dom';

global.chrome = {
  runtime: {
    onInstalled: {
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