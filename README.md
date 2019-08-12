# Stripe Coupon Management Slack App

This is a Slack and Stripe based coupon management system, written in Node.js
on [Standard Library](https://stdlib.com). After generating a coupon code with the `/create-coupon` slash command, you can either give the code to a potential new subscriber or apply the code directly to an existing subscription with the `/apply-coupon` command.

![](./readme/images/message.png)

## Deploying this Application

You can deploy this Slack App to [Standard Library](https://stdlib.com) by clicking this button:

[<img src="https://deploy.stdlib.com/static/images/deploy.svg" width="192">](https://deploy.stdlib.com/)

You'll be asked to create a new account or log in, then you will see a screen that looks something like this:

![](./readme/images/deploy.png)

Before you can deploy the app, you will need to link a Slack app and a Stripe app in **test mode**.

### Stripe

Click the **Link Resource** button, then select a Stripe app. You're linking your Stripe app in test mode, so your coupon management bot will not interact with any live data yet –– you'll be able to link your production Stripe app after you've tested everything!

### Slack

Click **Link Resource** and follow the instructions to build and link a Slack app.

**Note:** Once deployed, you will still need to register the `/create-coupon` and `/apply-coupon` commands separately in your Slack app dashboard.
For the slash command's request URL, enter `https://<username>.events.stdlib.com/`.

### Creating the Commands on Slack

You can create the `/create-coupon` and `/apply-coupon` commands by visiting [api.slack.com/apps](https://api.slack.com/apps),
selecting your app, then clicking **Slash commands** on the left sidebar.

![](./readme/images/slack-create-command.png)

Click **Create Command** and fill out the first command information. You'll want to
use `/create-coupon` as the command name and `https://<username>.events.stdlib.com/` as the
URL, where `<username>` is your Standard Library username.

![](./readme/images/slack-command-info.png)

Click **Save** in the bottom right to proceed. Repeat this process for `/apply-coupon`.

### Set your Options Load URL

Next click **Interactive Components** on the left sidebar.
Scroll down to "Message Menus" and set the "Options Load URL" to be:
`https://<username>.api.stdlib.com/coupon-bot@dev/message_menu/`

Where `<username>` is your Standard Library username.

![](./readme/images/message-menu.png)

That's it, you're all done! Your Slack app should be ready to go.

# Thank You!

Please check out [Standard Library](https://stdlib.com/) or follow us on Twitter,
[@StdLibHQ](https://twitter.com/@StdLibHQ).