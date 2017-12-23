#! /usr/bin/env node
var fs = require('fs');
const jsonfile = require('jsonfile');
const webpack = require("webpack");
const webpackConfigCreator = require(`${__dirname}/webpack.config.js`);
const ncp = require('ncp').ncp;
var appRoot = require('app-root-path');

const buildFolder = process.argv[2] || 'build';
const tmpfolder = '.tmp_platformsh';
const prodfolder = process.argv[3] || 'build_platform';

ncp(buildFolder, prodfolder, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('done!');

  const base64RouteConfig = process.env.PLATFORM_ROUTES;
  let routesConfig = 'test';

  try {
    routesConfig = JSON.parse(Buffer.from(base64RouteConfig, 'base64').toString('ascii'));
  }catch(err) {

  }

  if (!fs.existsSync(tmpfolder)){
    fs.mkdirSync(tmpfolder);
  }

  jsonfile.writeFileSync(`${tmpfolder}/routes.json`, routesConfig);

  const webpackConfig = webpackConfigCreator(appRoot.toString(), prodfolder);

  webpack(
    webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log('ERROR');
        console.log(err);
      }

      console.log('GENERATED')
      const javascriptFile = stats.toJson().chunks[0].files[0];

      const data = fs.readFileSync(`${prodfolder}/index.html`, 'utf-8');

      let newValue;

      if(data.indexOf('{{platform-var-script}}') !== -1) {
        console.log('template string detected');
        newValue = data.replace('{{platform-var-script}}', `<script type="text/javascript" src="./${javascriptFile}"></script>`);
      } else {
        newValue = data.replace(/<script/, `<script type="text/javascript" src="/${javascriptFile}"></script><script`);
      }

      fs.writeFileSync(`${prodfolder}/index.html`, newValue, 'utf-8');

      console.log('Index.html updated');
    });
  });
