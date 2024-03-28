# The three level cache

This is a specification for whoever wants to implement a cache using a three-tier architecture. When attempting to load some data, the cache of that data might be in one of three states:

- **Hot**: (instant) the data was fetched recently and is still perfectly valid.
- **Warm**: (instant) the data was fetched previously, and while it's still valid an order to refresh it _in the background_ is issued.
- **Cold**: (slow) the data is either too old, or it has never been fetched before. We need to make a full request and save it in our cache.

This way, we can have two request modes that are instantaneous, while ensuring the data is always fresh. The advantage compared to traditional Hot/Cold caches is that, specially for a busy server, we reduce the amount of times we need to make users wait for the full cold cache.

We want this specification to be the building blocks of different system's caches, so we are going to detail it better.

## The retrieve function

We have a "key" and a "retrieve" function.

The **arguments** are an array of function arguments that represents a unique resource. They could be a single string like a filename, a url, an ID, etc. or a combination of arguments like a URL and a headers object.

Then **retrieve** function is a pure, asynchronous function, that is expected to take long\* time, that receives the key as its only argument and must return some serializable data. It's the same function no matter what the key is.

```js
import MyCacheSystem from "my-cache-system";

// Here with the defaults
const get = MyCacheSystem({
  hot: "10s",
  warm: "100s",
  keep: () => true,
  skip: () => false,
  toId: (...args) => JSON.stringify(args),
  retrieve: async (key) => {
    // ... (always required, there's no default)
  },
});

// An example of how to customize for the fetch() API
const get = MyCacheSystem({
  // Timeouts for how long the data is considered "hot"
  hot: "1h",

  // And how long the data is considered "warm"
  warm: "10h",

  // Only cache GET keys
  keep: (url, { method = "GET" } = {}) => method === "GET",

  // We don't care about other things like headers, so the URL
  // will be used to store in the cache DB (note: only "kept" calls
  // are kept anyway! so we also don't worry about POST or body)
  toId: (url) => url,

  // Our main function that takes longer time to execute and we want
  // to cache
  retrieve: async (url, { method, headers, body }) => {
    const res = await fetch(key, {
      method,
      body: body ? JSON.stringify(body) : null,
      headers: {
        // Default it to JSON
        "Content-Type": body ? "application/json" : null,
        ...headers,
      },
    });
    const body = await res.json();
    return body;
  },
});

// Using the cached retrieve function with the key "https://google.com"
const google = await get("https://google.com");

// This should be blazing fast since it's just been cached
const google = await get("https://google.com");
```
