"use strict";

// ------------------------
// Bolt App Initialization
// ------------------------
const { App, ExpressReceiver } = require('@slack/bolt');
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
  processBeforeResponse: true
});

// ------------------------
// Application Logic
// ------------------------
app.event('app_home_opened', async ({ event, say, ack }) => {
  console.log(`event: ${JSON.stringify(event)}`);
  await say(`Hello world, and welcome <@${event.user}> from AWS Lambda.`);
  await ack();
});

app.command("/lambda", async ({ ack, say }) => {
  await say(`slash command`);
  await  ack();
});

// ------------------------
// AWS Lambda Handler
// ------------------------
const awsServerExpress = require('aws-serverless-express');
const server = awsServerExpress.createServer(expressReceiver.app);
module.exports.app = (event, context) => {
  awsServerExpress.proxy(server, event, context);
};