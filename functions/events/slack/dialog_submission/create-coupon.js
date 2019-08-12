const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
/**
* An HTTP endpoint that acts as a webhook for Slack dialog_submission event
* @param {object} event Slack dialog_submission event body (raw)
* @returns {object} workflow The result of your workflow steps
*/
module.exports = async (event) => {

  let name = event.submission.name;
  let durationMonths = Number(event.submission.duration);
  let redemptionWindowDays = Number(event.submission.redemption_window);
  let percentOff = Number(event.submission.percent_off);

  // Prepare workflow object to store API responses

  let workflow = {};

  console.log(`Running stripe.coupons[@0.0.1].create()...`);

  workflow.coupon = await lib.stripe.coupons['@0.0.3'].create({
    duration: durationMonths === 1 ? 'once' : 'repeating',
    percent_off: percentOff,
    duration_in_months: durationMonths === 1 ? null : durationMonths,
    max_redemptions: 1,
    metadata: null,
    name: name || `Special Discount`,
    redeem_by: redemptionWindowDays ? Math.floor((new Date().valueOf() / 1000) + 86400 * redemptionWindowDays) : null
  }).catch(async (e) => {
    await lib.slack.messages['@0.4.6'].ephemeral.create({
      text: `There was a problem creating your coupon:`,
      channelId: event.channel.id,
      userId: event.user.id,
      attachments: [{
        text: e.message,
        color: '#de4e2b'
      }]
    });
    throw e;
  });


  let redeemBy = !!workflow.coupon.redeem_by ? new Date(workflow.coupon.redeem_by * 1000) : null;
  let isProduction = !!workflow.coupon.livemode;

  console.log(`Running slack.messages[@0.4.6].create()...`);

  workflow.response = await lib.slack.messages['@0.4.6'].create({
    text: `<@${event.user.name}> created a coupon in *${isProduction ? 'live' : 'test'}mode*!`,
    id: event.channel.id,
    attachments: [{
      color: '#52d1c7',
      title: 'View Coupon in Stripe',
      title_link: `https://dashboard.stripe.com/${isProduction ? '': 'test/'}coupons/${encodeURIComponent(workflow.coupon.id)}`,
      text: workflow.coupon.id,
      fields: [{
        title: 'Name',
        value: workflow.coupon.name,
        short: true
      }, {
        title: 'Percent Off',
        value: `${workflow.coupon.percent_off}%`,
        short: true
      }, {
        title: 'Valid Until',
        value: !!redeemBy ? redeemBy.getFullYear() + '/' + (redeemBy.getMonth() + 1) + '/' + redeemBy.getDate() : 'Redemption',
        short: true
      }, {
        title: 'Discount Duration',
        short: true,
        value: workflow.coupon.duration === 'repeating' ? `${workflow.coupon.duration_in_months} months` : '1 month'
      }]
    }]
  });

  return workflow;
};