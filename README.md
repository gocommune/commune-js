# **Commune SDK**

Commune is a no/low-code platform that helps you discover hidden user insights, build complex A/B tests, and unlock new opportunities for growth. This SDK will help you integrate Commune's experimentation APIs into your Node.js projects.

## **Installation**

You can install the Commune SDK via npm:

```bash
npm install commune-sdk
```

## **Usage**

Here's how you can use the Commune SDK:

```jsx
import commune from "commune-sdk";

const communeClient = commune.createClient({ projectKey: "YOUR_PROJECT_KEY" });

// Activate experiment
const activateResult = communeClient.activate("experimentKey");

// Get multivariant
const multivariant = communeClient.getMultivariant("experimentKey");

// Get single variant
const variant = communeClient.getVariant("experimentKey", "variableName");

// Track event
communeClient.track("eventName", { key: "value" });
```

Please replace **`'YOUR_PROJECT_KEY'`**, **`'experimentKey'`**, **`'variableName'`**, **`'eventName'`**, and **`{ data }`** with your actual values.

## **Support**

If you have any issues or requests, feel free to reach us at **[hello@commune.cx](mailto:hello@commune.cx)**.
