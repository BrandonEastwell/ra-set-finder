const searchRouter = require("../routes/searchRouter");
const request = require("supertest");
const express = require("express");
const app = express();

app.use("/search", searchRouter);

jest.mock("../controllers/searchController", () => (
  {
    searchController: jest.fn((req, res) => {
      res.status(200).json({ results: [] });
    })
  }
))

describe('search API route testing', () => {
  test("search route works", async () => {
    await request(app)
      .get("/search?artist=fred")
      .expect("Content-Type", /json/)
      .expect({ results: [] })
      .expect(200)
  })
});
