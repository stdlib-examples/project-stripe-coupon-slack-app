const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
/**
* An HTTP endpoint that acts as a webhook for Slack dialog_submission event
* @param {object} event Slack dialog_submission event body (raw)
* @returns {object} workflow The result of your workflow steps
*/
module.exports = async (event) => {

  let subscriptionId = event.submission.subscription.split('|')[0];
  let subscriptionEmail = event.submission.subscription.split('|')[1];
  let couponId = event.submission.coupon.split('|')[0];
  let couponDetails = event.submission.coupon.split('|')[1];

  // Prepare workflow object to store API responses

  let workflow = {};

  // [Workflow Step 1]

  console.log(`Running stripe.subscriptions[@0.0.6].update()...`);

  workflow.subscription = await lib.stripe.subscriptions['@0.0.6'].update({
    id: subscriptionId,
    coupon: couponId
  }).catch(async (e) => {
    await lib.slack.messages['@0.4.6'].ephemeral.create({
      text: `There was a problem applying your coupon:`,
      channelId: event.channel.id,
      userId: event.user.id,
      attachments: [{
        text: e.message,
        color: '#de4e2b'
      }]
    });
    throw e;
  });

  // [Workflow Step 2]

  let isProduction = !!workflow.subscription.livemode;

  console.log(`Running slack.messages[@0.4.6].create()...`);

  workflow.response = await lib.slack.messages['@0.4.6'].create({
    id: `${event.channel.id}`,
    text: `Successfully applied the coupon!`,
    attachments: [{
      color: '#52d1c7',
      title: 'View Subscription in Stripe',
      title_link: `https://dashboard.stripe.com/${isProduction ? '': 'test/'}subscriptions/${encodeURIComponent(subscriptionId)}`,
      text: `*${subscriptionEmail}* now has ${couponDetails}`
    }]
  });

  return workflow;
};