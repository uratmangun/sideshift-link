# SideShift Pay Integration Guide

This guide will help you integrate our Stripe-like crypto payment solution into your webshop. Follow the steps below to create checkouts, redirect users for payment, and receive payment notifications via webhooks.

## Introduction

**SideShift Pay** offers a simple and seamless way to accept cryptocurrency payments in your webshop. By integrating our checkout feature, you can allow your customers to pay with any supported cryptocurrency, while you receive settlements in the coin of your choice.

## Prerequisites

- **SideShift.ai Account**: Ensure you have an active SideShift.ai account.
- **Account ID and Private Key**:
  - **Account ID**: Your unique identifier on SideShift.ai. It can also be used as the `affiliateId` to receive commissions.
  - **Private Key**: Your API secret key used for authentication.
  - Both can be acquired from [https://sideshift.ai/account](https://sideshift.ai/account).
- **Affiliate ID**: The Account ID of the account that should receive the commission. It can be your own Account ID or any other Account ID.
- **Web Server**: Your webshop should be able to handle HTTP requests and responses.

## Creating a Checkout

To create a new checkout, make a `POST` request to the `/v2/checkout` endpoint with the necessary parameters. This will set up the payment details where **you** (the merchant) specify your settlement preferences.

### Endpoint

```
POST https://sideshift.ai/api/v2/checkout
```

### Request Headers

- `Content-Type: application/json`
- `Accept: application/json`
- `x-sideshift-secret: YOUR_PRIVATE_KEY`
- `x-user-ip: END_USER_IP_ADDRESS` (IP address of the customer initiating the checkout)

### Request Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `settleCoin` | string | Yes | The coin you want to receive (e.g., `"BTC"`, `"ETH"`) |
| `settleNetwork` | string | Yes | The network of the settle coin (e.g., `"mainnet"`) |
| `settleAmount` | string | Yes | The amount you expect to receive |
| `settleAddress` | string | Yes | Your wallet address where the settlement will be sent |
| `settleMemo` | string | No | Required if the coin uses a memo/tag |
| `affiliateId` | string | Yes | The Account ID that should receive the commission |
| `successUrl` | string | Yes | URL to redirect the user after a successful payment |
| `cancelUrl` | string | Yes | URL to redirect the user if the payment is cancelled |

### Example Request

```bash
curl --request POST \
  --url 'https://sideshift.ai/api/v2/checkout' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'x-sideshift-secret: YOUR_PRIVATE_KEY' \
  --header 'x-user-ip: END_USER_IP_ADDRESS' \
  --data '{
    "settleCoin": "ETH",
    "settleNetwork": "mainnet",
    "settleAmount": "0.01",
    "settleAddress": "YOUR_ETH_ADDRESS",
    "affiliateId": "YOUR_ACCOUNT_ID",
    "successUrl": "https://yourwebshop.com/success",
    "cancelUrl": "https://yourwebshop.com/cancel"
  }'
```

### Successful Response

```json
{
  "id": "uniqueCheckoutID",
  "settleCoin": "ETH",
  "settleNetwork": "mainnet",
  "settleAddress": "YOUR_ETH_ADDRESS",
  "settleAmount": "0.01",
  "updatedAt": "2025-11-05T17:00:13.927000000Z",
  "createdAt": "2025-11-05T17:00:13.927000000Z",
  "affiliateId": "YOUR_ACCOUNT_ID",
  "successUrl": "https://yourwebshop.com/success",
  "cancelUrl": "https://yourwebshop.com/cancel"
}
```

## Redirecting Users to the Payment Page

After creating the checkout, redirect your customers to the **SideShift Pay** payment page where they can complete the payment. **Customers can choose any of the supported cryptocurrencies to pay with.**

### Payment URL Format

```
https://pay.sideshift.ai/checkout/{uniqueCheckoutID}
```

Replace `{uniqueCheckoutID}` with the `id` returned from the checkout creation response.

## Setting Up Webhooks

To be notified when a payment is either `success` or `fail`, you need to set up a webhook. SideShift.ai will send a POST request to your specified `targetUrl` whenever there is an update on the checkout.

> **Note:** Currently, webhooks are set up via a GraphQL mutation. A UI-based setup will be available in the future.

### Creating a Webhook

Make a `POST` request to the GraphQL endpoint to create a webhook.

### Endpoint

```
POST https://sideshift.ai/graphql
```

### Request Headers

- `Content-Type: application/json`
- `x-sideshift-secret: YOUR_PRIVATE_KEY`

### Request Body

```json
{
  "query": "mutation { createHook(targetUrl: \"https://yourwebshop.com/api/webhooks/sideshift\") { id createdAt updatedAt targetUrl enabled } }"
}
```

### Example Request

```bash
curl --request POST \
  --url 'https://sideshift.ai/graphql' \
  --header 'Content-Type: application/json' \
  --header 'x-sideshift-secret: YOUR_PRIVATE_KEY' \
  --data '{"query":"mutation { createHook(targetUrl: \"https://yourwebshop.com/api/webhooks/sideshift\") { id createdAt updatedAt targetUrl enabled } }"}'
```

### Successful Response

```json
{
  "data": {
    "createHook": {
      "id": "uniqueHookID",
      "createdAt": "2025-11-05T17:00:13.927000000Z",
      "updatedAt": "2025-11-05T17:00:13.927000000Z",
      "targetUrl": "https://yourwebshop.com/api/webhooks/sideshift",
      "enabled": true
    }
  }
}
```

## Handling Webhook Notifications

Your server should handle incoming POST requests to the `targetUrl`. The notifications will include details about the checkout and its status.

### Example Notification Payload

```json
{
  "meta": {
    "hook": {
      "id": "webhookUniqueId",
      "createdAt": "2025-11-05T17:00:13.927000000Z",
      "updatedAt": "2025-11-05T17:00:13.927000000Z",
      "enabled": true,
      "accountId": "YourAccountId",
      "targetUrl": "YourWebhookUrl"
    }
  },
  "payload": {
    "shiftId": "ShiftId",
    "status": "success",
    "txid": "txHash"
  }
}
```

### Status Values

| Status | Description |
|--------|-------------|
| `success` | Payment has been settled |
| `fail` | Payment ended unsuccessfully (refunded) |

## Sample Code

### Creating a Checkout (JavaScript)

```javascript
const response = await fetch('https://sideshift.ai/api/v2/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-sideshift-secret': 'YOUR_SECRET_KEY',
    'x-user-ip': customerIpAddress
  },
  body: JSON.stringify({
    settleCoin: 'BTC',
    settleNetwork: 'mainnet',
    settleAmount: '0.001',
    settleAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    affiliateId: 'YOUR_ACCOUNT_ID',
    successUrl: 'https://yourwebshop.com/success',
    cancelUrl: 'https://yourwebshop.com/cancel'
  })
});

const checkout = await response.json();
// Redirect customer to: https://pay.sideshift.ai/checkout/${checkout.id}
```

### Handling Webhook Notifications (Express.js)

```javascript
app.post('/webhooks/sideshift', (req, res) => {
  const { meta, payload } = req.body;
  const { shiftId, status, txid } = payload ?? {};

  switch (status) {
    case 'success':
      console.log(`Shift ${shiftId} succeeded with txid ${txid}`);
      // Update order status in your database
      break;
    case 'fail':
      console.log(`Shift ${shiftId} failed`);
      // Handle failed payment
      break;
  }

  res.status(200).send('OK');
});
```

### Checking Order Status

```javascript
// Fetch checkout data
const checkoutResponse = await fetch(`https://sideshift.ai/api/v2/checkout/${checkoutId}`);
const checkout = await checkoutResponse.json();

// Get the latest shift/order ID
const shiftId = checkout.orders?.[0]?.id;
if (!shiftId) {
  throw new Error('No shiftId found');
}

// Fetch the shift to get the status
const shiftResponse = await fetch(`https://sideshift.ai/api/v2/shifts/${shiftId}`);
const shift = await shiftResponse.json();
console.log('Latest order status:', shift.status);
```
