# Loading 4GB JSON into the browser

> TL;DR: I implemented a custom _streaming_ and parsing solution in the browser's own JS, that would make a first quick pass to create an index of "frame:start_byte:end_byte". From this, I created a player-like UI that allowed us to pick one of those frames, and then only parse the corresponding bytes.

You want me to create a web-app to drop JSON files into the browser and read its data? Sure no problem, I got you:

```jsx
<input type="file" onChange={e => {
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    console.log(data);
  };
  reader.readAsText(e.target.files[0]);
}}>
```

What do you mean it's a 4GB JSON file? Oh your browser is crashing? Well I'm not surprised...

## The problem

I was at a startup dealing with a lot of ML data, but we were struggling with debugging the ML algorithms. Turns out, we didn't have good visualization tools, so when there was a problem at the end of the pipeline we didn't know which step had gone wrong.

That's when one of the founders came to me with an experiment; let's try to use JS and Three.js to create a visualization tool in the browser. The first step was to find out if we could even load the data (this post). We were extracting 2D and 3D structures from multiple videos, meaning a file would consist of data that was around 1MB-2MB of 2D+3D data per frame, at 24 FPS, and each run taking around 10-20 min, something like this:

```json
[
  {
    "index": 0,
    "raw_points": [{
      "x": 4504.8627929287751712,
      "y": 2334.6405295822472747,
      "z": 146.595894921416274
    }, ...],    // Many more points
    "poses_2d": [{
      "id": 0,
      "cam": 0,
      "left_foot": {
        "x": 424.4992992304568904,
        "y": 5443.6693946494999994,
      }, ...   // Many more points
    }, ...],  // Many more poses
    "poses_3d": [{
      "id": 0,
      "left_foot": {
        "x": 4504.8627929287751712,
        "y": 2334.6405295822472747,
        "z": 146.595894921416274
      }, ...  // Many more points
    }, ...]  // Many more poses
  }, {
    "index": 1,
    "raw_points": [...],
    "poses_2d": [...],
    "poses_3d": [...]
  },
  // Many more frames
]
```

For the astute reader, yes I suggested that since we were dealing with centimeters in the 3D data, and pixels in the 2D data, we could round them up to [stop measuring atoms](https://xkcd.com/2170/) so that 4GB file would become few hundred MBs, but at that point we had millions spent on ML stuff and I was just the new guy, so I didn't have much of a say.

Back to the problem, how do you even load a 4GB JSON file like that in the browser? Preferably with a simple drag and drop from a local file.

## Solutions

I did consider a number of solutions, having experience with Node.js and all:

- _Naive solution_: the snippet heading this blog post. No, the browser would just blow up.
- _Pre-process?_: pre-process the file on the back-end to strip all of the extra decimals and data that we weren't using, maybe even with some light optimizations, hoping the browser would not blow up.
  - Problem: now we need a backend, and our data people would need to either run that locally, or wait for 4GB file uploads. We wanted instead to drag-and-drop into a UI and BAM, visualize the data, anything less was not an option.
- _Back-end processing_: there's many streaming solutions to read files for Node.js that would allow us not to read the file at once. But we run into the same problem as before.
- _~~Ask the ML to stop counting atoms~~_
- _Can we data-stream on the browser?_ 🫣

So one of the benefits was that we could consider the data to be ~~prettified~~ properly indented. Before my time, we used to use JSONL, which would have been amazing here, but now we didn't anymore and so it wasn't clear we'd be able to find any solution:

```json
// We didn't have this anymore, unfortunately // Wait you cannot comment on JSON files!  // But this is JSONL  // Isn't that even worse than JSON?  // ...
[{ "index": 0, "raw_points": [...], "poses_2d": [...], "poses_3d": [...], ... }]
[{ "index": 1, "raw_points": [...], "poses_2d": [...], "poses_3d": [...], ... }]
[{ "index": 2, "raw_points": [...], "poses_2d": [...], "poses_3d": [...], ... }]
```

But the streaming solution still sounded interesting, so let's give it a go!

## Streaming files in the browser

Since we had a very well-defined file structure that [won't d͇̹͎͖e͎̫̻͕͒͒s͚͈̭̦̈́c̖̩̮̔e͎̫̻͕͒n͕̰̳̏d͇̹͎͖́͐ ĭ̢̜n͕̰̳̏t͙ó͎̥ m̬̟̑ád͇̹͎͖́͐n͕̰e͎̫̻͕͒͒s͚͈̭̦̈́s͚͈̭̦̈́ oh no](https://stackoverflow.com/a/1732454/938236), my next naive-ish solution was to stream-read the files. First I attempted to _only read the data that we actually needed_, praying that it would fit into memory.

So we need to manually read bytes, interpret them as text, find the delimiters and manually pars eit. Easy peasy, we _know_ our delimiter was going to be `"  }, {"` since that's when one frame stopped and the next started, so [let's read bytes](https://stackoverflow.com/a/24433285/938236):

```js
// You can skip this if you want, it still didn't work for 4GB files
// Note: this isn't the original code ofc, in fact it's prob better (4-5 more years of experience)
// I just created a quick working snippet for demo purposes
const PAGE_SIZE = 10000;
const DELIMITER = `  },
  {`;

const parseSegment = (str) => {
  const data = JSON.parse("{" + str + "}");
  // I actually did a bunch of things here to remove unnecessary data
  return data;
};

const parseFile = async (file) => {
  const size = file.size;
  const frames = []; // Where we store the final data
  let partial = ""; // Partial data storage
  for (let i = 0; i < file.size; i += PAGE_SIZE) {
    // Avoid the first'[   \n{'
    let startingByte = i * PAGE_SIZE + (i === 0 ? 5 : 0);
    let endingByte = startingByte + PAGE_SIZE;
    let part = await file.slice(startingByte, endingByte).text();
    const segments = (partial + part).split(DELIMITER);
    partial = segments.pop();
    segments.forEach((segment) => {
      frames.push(parseSegment(segment));
    });
  }
  // Remove the last "}]"
  frames.push(parseSegment(partial.slice(0, -4)));
  return frames;
};

document.querySelector("input").addEventListener("change", async (e) => {
  var reader = new FileReader();
  const prettyData = await parseFile(e.target.files[0]);

  // This is just for visualizing the data, wasn't part of the script:
  console.log(prettyData);
});
```

> [**See working demo**](https://jsfiddle.net/franciscop/dt17rh8f/).

The real implementation was a bit different and had a bunch more of micro-optimizations, but that works and gets the gist of it. However, now we had two problems instead of one:

- It was taking a long time to JSON.parse() all of that data! As per the flame graph, that was the bottleneck. It took approx as long as the original video lasted.
- It crashed anyway from out of memory when it hadn't traversed even a fraction of the whole file, defeating the point again.

## Can we do better?

Of course we can, otherwise you wouldn't be reading this and I wouldn't have lasted over 3 years at the startup.

Since it was clear at this point that we could keep a file reference (for "free" memory-wise) and read it byte by bite, it occurred to me to process it differently. Let's NOT JSON-parse it, and instead create an index of where each JSON slice is, and load those on-demand!

This time I won't bore you with code, it was similar to the above:

1. Load the file as usual, keeping the `file` reference handy.
2. Go through the file, page by page, finding all those pesky `  },{` that delimit where our frames are. It would take 1~5 seconds to find all the references, and I build a progress bar that was actually based on real % of the file parsed and not a [phony one](https://www.theatlantic.com/technology/archive/2017/02/why-some-apps-use-fake-progress-bars/517233/).
3. Store those indexes as a frame reference, in a simple array `frames = [[3,324234],[324235,4353242],...]`.
4. Now we know how many frames there are, and where the data for those frames is. We can build a UI for it!
5. When needed, `file.slice()` only those bytes, and `JSON.parse()` only that single frame. That would still take around 30-40ms per frame\*, _just enough_ for real-time playing.

\* this was pre-Apple-m1 processors, which is a pity beacause I'd love to see that original code running in one of those!

## Show me the 3D!

We could load all of those 3D points with this new small project called `react-three-fiber` into a 3D visualization. Eventually we also had a 3D representation of the store, a 3D pointcloud scan of it, and the camera position+angles, all running in the browser. It was pretty cool (but this blog is only about that purple skeleton moving around):

<iframe width="560" height="315" src="https://www.youtube.com/embed/QXkzKTMYkUU?start=8" frameborder="0" allowfullscreen></iframe>

So the 3D UI is as you can see in the video, what you cannot see is a couple of things.

There was a video player like UI on the bottom, with a traditional "Play" button and a scrub bar to pick which frame you wanted to read (from the array we built above!). Furthermore, since this was very important, you could go frame by frame with the keyboard arrow keys to dig into the details of why the ML was farting.

At any point in time, you could grab the 3D fragment and rotate/move/zoom it to see the 3D points from different angles. This was a key thing initially, since the 2d pose would seem correct from a camera point of view, but not in 3d, and this unblocked a lot of debugging.

So when you went with the scrubbing bar anywhere, or the keyboard, we would `file.slice(start, end)` that JSON fragment, parse it into real data, and put it into 3D. Neat.

## What happened with it

Eventually this little script I wrote evolved into a "big company project", with 4 devs (including me) working full-time on it, and we moved this logic to the backend to better integrate with other systems. That was the end of this beautiful snippet capable of loading large JSON files in the browser.

Since the base was pretty solid, we kept adding features to it, and at one point I believe all of the departments in the company were using it one way or another:

- Ofc ML people used it when there was an issue, they could dig into a specific frame and see the 2D, 3D, partial data, and see the analysis logs right into the tool.
- Reviewers used it to make sure the events that the ML said happened, actually happened.
- Installation (setting up a new store) used it to verify the camera video feeds and camera positions.
- We added a real time mode that was used to control the stores were all working properly (e.g. a camera was down, etc). It was also used by the managers in the store, and since we were techy they showed it to our techy visitors.
- At some point I even caught the CEO showing this to investors in a store in real time, and a few weeks/months later we announced a new investment round, so I like to say it was used to make us become a unicorn, even if just to entertain myself.

To my eternal dismay, the day I left you could still, if you wanted so, use it to track atoms in the universe.
