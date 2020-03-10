// Copyright 2020 Francisco Presencia (francisco.io)
const play = (() => {
  const clean = line =>
    line
      .trim()
      .replace(/^\[/, "")
      .replace(/\]$/, "");

  const parseCommand = line => ({
    line,
    type: clean(line.split("]")[0])
      .split(":")[0]
      .trim(),
    name: clean(line.split("]")[0])
      .split(":")[0]
      .trim(),
    // The thing on the navbar
    title:
      clean(line.split("]")[0])
        .split(":")
        .slice(1)
        .join(":") || "",
    extra: clean(line.split("]")[0])
      .split(":")
      .slice(1),
    command: clean(line.split("]")[1]).trim(),
    content: []
  });

  const parse = text => {
    const baseSpace = Math.min(
      ...text
        .split("\n")
        .filter(Boolean)
        .map(a => a.match(/\s*/)[0].length)
    );
    return text
      .trimEnd()
      .split("\n")
      .map(line => line.slice(baseSpace))
      .reduce((arr, line) => {
        const last = arr[arr.length - 1];
        // When it starts by a `[` create a new command
        if (/^\s*\[/.test(line)) {
          return arr.concat(parseCommand(line));
        }
        if (last) {
          last.content.push(line);
        }
        return arr;
      }, [])
      .map(it => {
        console.log(it);
        return { ...it, content: it.content.join("\n") };
      });
  };

  const show = (name, title = "") => {
    const stop = u(name).is(".active");
    u("play-time > *").removeClass("active");
    u(name).addClass("visible active");
    u(name).data("title", " " + title);
    return stop || play.wait(500);
  };

  let reset;
  const type = async (element, text, cb = () => {}) => {
    reset = false;

    for (const char of text.split("")) {
      while (!u("play-time").hasClass("play")) {
        if (reset) return;
        await play.wait(200);
      }
      if (reset) return;
      element.text(element.text() + char);
      element.first().scrollTop = element.first().scrollHeight;
      cb({ element });
      await play.wait(/\W/.test(char) ? 250 : 80);
    }
  };

  function play(inst) {
    if (!(this instanceof play)) {
      return new play(inst);
    }

    const base = u("play-time").addClass("play");
    const text = inst || base.text();
    base.text("");
    base.append(`<play-control><span class="play"></span></play-control>`);
    const control = base.find("play-control");

    const commands = parse(text).map(item => {
      if (!base.find(`.${item.type}`).length) {
        control.before(
          `<play-window class="${
            item.type
          }"><div class="content"></div></play-window>`
        );
      }
      control.append(`<span class="step"></span>`);
      return {
        ...item,
        element: base.find(`play-window.${item.type} .content`)
      };
    });
    console.log(base.find(".content"));
    u("play-window").append(
      `<a class="play-credit" href="https://francisco.io/demo/terminal">francisco.io</a>`
    );
    control.find(".play").on("click", e => {
      base.toggleClass("play");
    });
    control.find(".step").on("click", e => {
      reset = true;
      const i = u(e.currentTarget)
        .parent()
        .children()
        .nodes.indexOf(e.currentTarget);
      base.data("i", i);
      renderStep(i - 1);
      highlightStep(i - 1);
      base.removeClass("play");
    });

    const highlightStep = i => {
      u("play-control .step").each((el, index) => {
        if (i === index) u(el).addClass("visited");
        u(el).toggleClass("active", i === index);
      });
    };

    const renderTerminal = async (title, text) => {
      base.find(`play-window.terminal .content`).text(text);
      await show("play-window.terminal", title + " — terminal");
    };

    const renderBrowser = async (title, text) => {
      base.find(`play-window.browser .content`).text(text);
      await show("play-window.browser", title + " — browser");
    };

    const renderCode = async (title, text) => {
      if (typeof Prism === "undefined") {
        base.find(`play-window.code .content`).text(text);
      } else {
        const ext = title.split(".").pop() || "js";
        base
          .find(`play-window.code .content`)
          .html(Prism.highlight(text, Prism.languages.javascript, ext));
      }
      await show("play-window.code", title + " — code");
    };

    const renderStep = i => {
      const step = commands[i];
      const same = commands
        .slice(0, i + 1)
        .filter(com => com.type === step.type);
      let last = null;
      same.forEach((com, i) => {
        if (last === null && com.title === step.title) {
          last = i;
        }
        if (com.title !== step.title) {
          last = null;
        }
      });
      const steps = same.slice(last);
      if (step.type === "terminal") {
        const renderCom = com =>
          `$ ${com.command}${com.content ? "\n" : ""}${com.content}`;
        const text = steps.map(renderCom).join("\n");
        renderTerminal(step.title, text);
      }
      if (step.type === "code") {
        renderCode(step.title, step.content);
      }
      if (step.type === "browser") {
        renderBrowser(step.title, step.content);
      }
    };

    const loop = async () => {
      const i = parseInt(base.data("i"), 10) || 0;
      await play.wait(100);
      if (!base.hasClass("play")) return loop();
      if (i >= commands.length) {
        base.removeClass("play");
        return loop();
      }
      const item = commands[i];
      highlightStep(i);

      await play[item.type](item);

      if (reset) return loop();
      await play.wait(100);
      base.data("i", (parseInt(base.data("i"), 10) || 0) + 1);
      loop();
    };
    loop();
  }

  play.terminal = async ({ element, command, content, title }) => {
    await show("play-window.terminal", title + " — terminal");
    element.text(element.text() + (element.text() ? "\n" : "") + "$ ");
    await type(element, command);
    if (reset) return;
    element.text(`${element.text()}\n${content}`.trim());
    element.first().scrollTop = element.first().scrollHeight;
    await play.wait(1000 + parseInt(content.length * 25));
  };

  play.browser = async ({ element, content, title }) => {
    element.html(content);
    await show("play-window.browser", title + " — browser");
  };

  play.code = async ({ element, content, command, title }) => {
    const ext = title.split(".").pop();
    element = element.html(`<pre><code class="language-${ext}"></code></pre>`);
    await show("play-window.code", title + " — code");
    await type(element, content, ({ element }) => {
      if (typeof Prism === "undefined") return;
      element.html(
        Prism.highlight(element.text(), Prism.languages.javascript, ext)
      );
    });
    await play.wait(1000);
  };

  play.wait = time => new Promise(resolve => setTimeout(resolve, time));

  // Export it for webpack
  if (typeof module === "object" && module.exports) {
    module.exports = play;
  }
  return play;
})();
