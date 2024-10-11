import { cc } from "bun:ffi";

export const {
  symbols: { hello },
} = cc({
  source: "./hello.c",
  include: ["/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include"], // ❗ manually
  symbols: {
    hello: {
      returns: "void",
      args: [],
    },
  },
});

hello();
