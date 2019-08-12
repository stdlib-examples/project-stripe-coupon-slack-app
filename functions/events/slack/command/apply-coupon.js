const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

/**
* An HTTP endpoint that acts as a webhook for Slack command event
* @param {object} event Slack command event body (raw)
* @returns {object} workflow The result of your workflow steps
*/
module.exports = async (event) => {

  // Prepare workflow object to store API responses

  let workflow = {};

  console.log(`Running slack.dialog[@0.0.4].open()...`);

  workflow.response = await lib.slack.dialog['@0.0.4'].open({
    dialog: {
      callback_id: 'apply-coupon',
      title: 'Apply a coupon',
      submit_label: 'Apply',
      elements: [{
        label: 'Which subscription should receive the coupon?',
        name: 'subscription',
        type: 'select',
        placeholder: 'Select a subscriber...',
        data_source: 'external'
      }, {
        label: 'Which coupon would you like to apply?',
        name: 'coupon',
        type: 'select',
        placeholder: 'Select a coupon...',
        data_source: 'external'
      }]
    },
    trigger_id: event.trigger_id
  });

  return workflow;
};