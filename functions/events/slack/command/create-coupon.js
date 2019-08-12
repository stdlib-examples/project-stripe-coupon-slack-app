const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
/**
* An HTTP endpoint that acts as a webhook for Slack command event
* @param {object} event Slack command event body (raw)
* @returns {object} workflow The result of your workflow steps
*/
module.exports = async (event) => {

  // Prepare workflow object to store API responses
  
  let workflow = {};
  
  // [Workflow Step 1]
  
  console.log(`Running slack.dialog[@0.0.4].open()...`);
  
  workflow.dialog = await lib.slack.dialog['@0.0.4'].open({
    trigger_id: event.trigger_id,
    dialog: {
      callback_id: 'create-coupon',
      title: 'Create a coupon',
      submit_label: 'Create',
      elements: [{
        label: 'What is this coupon for?',
        name: 'name',
        type: 'text',
        placeholder: 'Special discount',
        optional: true
      }, {
        label: 'What percentage off should the discount be?',
        name: 'percent_off',
        placeholder: 'for example, 10',
        type: 'text',
        subtype: 'number'
      }, {
        label: 'How long should the discount apply for?',
        name: 'duration',
        type: 'select',
        value: '1',
        options: [{
          label: 'One-time',
          value: '1'
        }, {
          label: '2 months',
          value: '2'
        }, {
          label: '3 months',
          value: '3'
        }, {
          label: '4 months',
          value: '4'
        }, {
          label: '5 months',
          value: '5'
        }, {
          label: '6 months',
          value: '6'
        }, {
          label: '7 months',
          value: '7'
        }, {
          label: '8 months',
          value: '8'
        }, {
          label: '9 months',
          value: '9'
        }, {
          label: '10 months',
          value: '10'
        }, {
          label: '11 months',
          value: '11'
        }, {
          label: '12 months',
          value: '12'
        }]
      }, {
        label: 'How long should the code stay valid?',
        name: 'redemption_window',
        type: 'select',
        value: '0',
        options: [{
          label: 'Until redemption',
          value: '0'
        }, {
          label: '1 week',
          value: '7'
        }, {
          label: '30 days',
          value: '30'
        }]
      }]
    }
  });
  
  return workflow;
};