import { readFileSync, writeFileSync } from 'node:fs';
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const manifestConfig = {
  name: "RA Set Finder",
  description: "Find sets on RA event pages",
  version: packageJson.version,
  manifest_version: 3,
  permissions: ["activeTab"],
  host_permissions: ["https://ra.co/events/*"],
  action: {
    default_popup: "src/popup/index.html",
    default_icon: "icons/react.svg"
  },
  options_page: "src/options/index.html",
  side_panel: {
    default_path: "src/side-panel/index.html"
  },
  background: {
    service_worker: "assets/background.js",
    type: 'module'
  },
  content_scripts: [
    {
      matches: ["https://ra.co/events/*"],
      js: ['assets/scraper.js'],
      run_at: "document_idle"
    }
  ]
}

writeFileSync('./dist/manifest.json', JSON.stringify(manifestConfig, null, 2))