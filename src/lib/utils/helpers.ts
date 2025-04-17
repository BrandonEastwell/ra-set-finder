function urlToEventId(url: string) {
  const splitUrl = url.split("/");
  return splitUrl[splitUrl.length - 1];
}

export {urlToEventId}