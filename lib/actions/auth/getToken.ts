"use server";

export async function getEntraIdToken() {
  const clientId = process.env.AZURE_AD_CLIENT_ID!;
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET!;
  const tenantId = process.env.AZURE_AD_TENANT_ID!;
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "2ff814a6-3304-4ab8-85cb-cd0e6f879c1d/.default",
    grant_type: "client_credentials",
  });

  const options = {
    method: "POST",
    headers: headers,
    body: body,
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error while trying to retrieve Entra ID Token:", error);
  }
}

export async function getDatabricksToken(token: string) {
  const baseUrl = process.env.DATABRICKS_SERVER_HOSTNAME;
  const url = `https://${baseUrl}/api/2.0/token/create`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const body = { lifetime_seconds: 60 };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.token_value;
  } catch (error) {
    console.error("Error while trying to retrieve Databricks Token:", error);
  }
}

export async function getPAT() {
  const entraIdToken = await getEntraIdToken();
  const databricksToken = await getDatabricksToken(entraIdToken);
  return databricksToken;
}
