import serialize from 'serialize-javascript';
const assets = require('./../../webpack-assets.json');

function render(req, res, metaData = {}) {
  const context = {};
  // Get Title from req object
  res.send(renderHtml(metaData));
}

function inlineFonts() {
  return `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700&display=swap" rel="stylesheet">
    <link href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">  
  `;
}

function inlineGlobalStyles() {
  return `
    body {
      font-family: 'Epilogue', sans-serif;
    }
  `;
}

function getStyleSheets(assets) {
  const mainCss = assets.main.css;
  if (!mainCss) {
    return '';
  }

  return `<link href="${mainCss}" as="style" rel="stylesheet"/>`;
}

function renderHtml({ title = 'Pallet', pageData = {} }) {
  const mainJs = assets.main.js;
  const vendorJs = assets.vendor.js;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <link rel="icon" href="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Youtube%20Channel%20Logo%20(1).png" style={{width: "16px", height: "16px"}}>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      ${inlineFonts()}
      ${getStyleSheets(assets)}
      <link rel="stylesheet" href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css">
    </head>
    <body>
      <div id="app"></div>
      <script>window.__pageData = ${serialize(pageData)}</script>
      <script src="${vendorJs}"></script>
      <script src="${mainJs}"></script>
    </body>
    </html>
  `;
}

export default render;
