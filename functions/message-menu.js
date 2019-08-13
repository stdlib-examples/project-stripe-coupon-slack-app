const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const MAX_DIALOG_LABEL_LENGTH = 70;

/**
* An HTTP endpoint that generates options for a dropdown in Slack
* @param {object} payload
* @returns {object.http}
*/
module.exports = async (payload) => {
  let options;
  if (payload.name === 'coupon') {
    let coupons = await lib.stripe.coupons['@0.0.6'].list({});
    options = coupons.data.filter((coupon) => {
      return !!coupon.valid;
    }).map((coupon) => {
      let discountString = coupon.percent_off ? coupon.percent_off + '% off' : coupon.amount_off + ' ' + coupon.currency.toUpperCase() + ' off';
      let discountDetails = `${discountString} ${coupon.duration_in_months ? 'for ' + coupon.duration_in_months + ' months' : 'once'}`;
      let label = `${coupon.name} – ${discountDetails}`;
      if (label.length > MAX_DIALOG_LABEL_LENGTH) {
        label = label.slice(0, MAX_DIALOG_LABEL_LENGTH) + '...';
      }
      return {
        label: label,
        value: `${coupon.id}|${discountDetails}`
      }
    });
  } else if (payload.name === 'subscription') {
    let customers = await lib.stripe.customers['@0.1.1'].list({});
    options = customers.data.filter((customer) => {
      return customer.subscriptions && customer.subscriptions.data.length && !!customer.subscriptions.data.find((subscription) => {
        return subscription.status === 'active' && !!subscription.items.data.length;
      });
    }).map((customer) => {
      let largestPlan = customer.subscriptions.data[0].items.data.reduce((largestPlan, item) => {
        if (item.plan && item.plan.amount >= largestPlan.amount) {
          largestPlan = item.plan;
        }
        return largestPlan;
      }, customer.subscriptions.data[0].items.data[0].plan);
      let largestPlanAmount = (largestPlan.amount / 100).toFixed(2);
      let label = `${customer.email} - ${largestPlan.nickname} (${largestPlanAmount} ${largestPlan.currency.toUpperCase()} / ${largestPlan.interval})`;
      if (label.length > MAX_DIALOG_LABEL_LENGTH) {
        label = label.slice(0, MAX_DIALOG_LABEL_LENGTH) + '...';
      }
      return {
        label: label,
        value: `${customer.subscriptions.data[0].id}|${customer.email}`
      };
    });
  }
  return {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      options: options
    })
  };
};