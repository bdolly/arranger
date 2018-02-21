import fetch from 'node-fetch';
import { parse } from 'query-string';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// import CurrentSQON from '@arranger/components/dist/Arranger/CurrentSQON';

export default async (req, res) => {
  fetch(
    `https://13gqusdt40.execute-api.us-east-1.amazonaws.com/Dev/${
      req.params.shortUrl
    }`,
  )
    .then(r => r.json())
    .then(data => {
      let content = data.value;
      let search = parse(content.longUrl.split('?').pop());

      let html = (
        <html>
          <head>
            <meta property="og:title" content={content['og:title']} />
          </head>
          <body>
            <script>window.location.href = content.longUrl</script>
          </body>
        </html>
      );

      res.send(renderToStaticMarkup(html));
    });
};
