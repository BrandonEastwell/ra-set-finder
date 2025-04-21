process.env.API_URL = 'https://www.googleapis.com/youtube/v3';
process.env.API_KEY = 'FAKE_API_KEY';

const request = require("supertest");
const { searchController } = require("../controllers/searchController")
const express = require("express");
const app = express();

global.res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn()
}

global.fetch = jest.fn().mockResolvedValue({
  json: async () => ({
    items: [{
      snippet: {
        title: "Rene Wise at the Dome",
        thumbnails: {
          default: {
            url: "someURL"
          }
        }
      },
      id: {
        videoId: 128375
      },
    }]
  }),
  status: 200,
  ok: true
});

describe('search controller tests', () => {
  it('should respond with search results from youtube', async () => {
    const req = { query: { artist: "Rene Wise" } }
    await searchController(req, res);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ results: [{title: "Rene Wise at the Dome", videoId: 128375, thumbnail: "someURL"}]})
  });

  it('should create a valid URL', async () => {
    const req = { query: { artist: "Rene Wise" } }
    await searchController(req, res);
    expect(fetch).toHaveBeenCalledWith("https://www.googleapis.com/youtube/v3/search?part=snippet&q=Rene+Wise+dj+set&maxResults=5&type=video&videoDuration=long&key=FAKE_API_KEY", {
      method: 'GET',
    })
  });
});

