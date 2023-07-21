import fetch from "cross-fetch";
import { v4 as uuidv4 } from "uuid";

const COMMUNE_HOST = "https://app.commune.cx";
const COMMUNE_ENDPOINTS = {
  ACTIVATE: "/api/client/experiment/activate",
  TRACK: "/api/client/experiment/track",
  VARIANT: "/api/client/experiment/variant",
};

class CommuneClient {
  constructor(config) {
    this.projectKey = config.projectKey;
    this.deviceId = config.deviceId || this._generateUUID();
    this.distinctId = config.distinctId || this.deviceId;
  }

  async activate(experimentKey, distinctId = this.distinctId) {
    const url = this._constructURL(COMMUNE_ENDPOINTS.ACTIVATE, {
      experimentKey,
      distinctId,
    });
    const result = await this._makePostRequest(url, {
      projectKey: this.projectKey,
      experimentKey,
    });
    return this._parseVariables(result?.variables);
  }

  async getMultivariant(experimentKey, distinctId = this.distinctId) {
    const url = this._constructURL(COMMUNE_ENDPOINTS.VARIANT, {
      experimentKey,
      distinctId,
    });
    const result = await this._makeGetRequest(url);
    return this._parseVariables(result?.variables);
  }

  async getVariant(experimentKey, variableName, distinctId = this.distinctId) {
    const url = this._constructURL(COMMUNE_ENDPOINTS.VARIANT, {
      experimentKey,
      distinctId,
    });
    const result = await this._makeGetRequest(url);
    const variables = this._parseVariables(result?.variables);
    return variables?.[variableName];
  }

  async track(eventName, data, distinctId = this.distinctId) {
    const url = this._constructURL(COMMUNE_ENDPOINTS.TRACK, { distinctId });
    const body = {
      event: {
        type: "custom",
        name: eventName,
        data: data || {},
        project_id: this.projectKey,
      },
    };
    return await this._makePostRequest(url, body);
  }

  _constructURL(endpoint, { experimentKey, distinctId }) {
    this.distinctId = distinctId;
    const url = new URL(`${COMMUNE_HOST}${endpoint}`);
    url.searchParams.append("projectKey", this.projectKey);
    url.searchParams.append("commune_device_id", this.deviceId);
    url.searchParams.append("commune_distinct_id", this.distinctId);
    if (experimentKey) url.searchParams.append("experimentKey", experimentKey);
    return url;
  }

  async _makeGetRequest(url) {
    const res = await fetch(url);
    if (!res.ok) {
      this._handleError(url, res);
      return null;
    }
    try {
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  async _makePostRequest(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      this._handleError(url, res);
      return null;
    }
    try {
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  async _handleError(url, res) {
    console.error(
      `Request failed: ${url} ${res.status} ${
        res.statusText
      } ${await res.text()}`
    );
  }

  _parseVariables(variables) {
    if (!variables) return null;
    return variables.reduce(
      (acc, variable) => ({
        ...acc,
        [variable.name]: variable.variant.value,
      }),
      {}
    );
  }

  _generateUUID() {
    return uuidv4();
  }
}

// Function to create a new instance of CommuneClient
const createClient = (config) => new CommuneClient(config);

export default { createClient };
