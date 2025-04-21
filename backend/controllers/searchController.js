async function searchController(req, res) {
  try {
    const { artist } = req.query;
    const query = artist + ' dj set';
    const url = new URL(`${process.env.API_URL}/search`);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', query);
    url.searchParams.set('maxResults', '5');
    url.searchParams.set('type', 'video');
    url.searchParams.set('videoDuration', 'long');
    url.searchParams.set('key', process.env.API_KEY);

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const sets = data.items.map((item) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    res.status(200).json({ results: sets });

  } catch (e) {
    console.log("Error: ", e);
    res.status(500).send(`Internal Server Error`);
  }
}

module.exports = { searchController }