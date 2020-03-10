play(`
  [terminal:~/web] node --version
  v13.5.0
  [terminal:~/web] npm init --yes
  Wrote to /home/[CURRENT_PATH]/package.json:
  ...
  [terminal:~/web] npm install server
  + server@1.0.18

  [code:index.js]
  import server from 'server';

  // Launch it on localhost:3000
  server(ctx => \`Hello world!\`);
  [terminal:~/web] node index.js

  [browser:http://localhost:3000/]
  Hello world!
`);
