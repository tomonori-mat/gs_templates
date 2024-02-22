function callLogging(accessToken) {
  let projectId = "projectName";
  // https://cloud.google.com/logging/docs/reference/v2/rest/v2/entries/list
  let endpoint = `https://logging.googleapis.com/v2beta1/entries:list`;
  let filter =
    'protoPayload.@type="type.googleapis.com/google.cloud.audit.AuditLog"';

  let headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  let data = {
    resourceNames: [`projects/${projectId}`],
    filter: filter,
    orderBy: "timestamp desc",
  };
  let options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(data),
    contentType: "application/json",
    muteHttpExceptions: true,
  };
  let response = UrlFetchApp.fetch(endpoint, options);
  let responseText = response.getContentText();
  let responseData = JSON.parse(responseText);

  let entries = responseData["entries"];
  let nextPageToken = responseData["nextPageToken"];

  return entries;
}

function getAccessToken() {
  let clientId =
    PropertiesService.getScriptProperties().getProperty("clientId");
  let clientSecret =
    PropertiesService.getScriptProperties().getProperty("clientSecret");
  let refreshToken =
    PropertiesService.getScriptProperties().getProperty("refreshToken");
  let grantType = "refresh_token";
  let endpoint = "https://www.googleapis.com/oauth2/v4/token";

  let data = {
    client_secret: clientSecret,
    grant_type: grantType,
    refresh_token: refreshToken,
    client_id: clientId,
  };

  let payload = Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");

  // Encode the payload data
  let options = {
    method: "post",
    "Content-Type": "application/x-www-form-urlencoded",
    payload: payload,
    muteHttpExceptions: true,
  };

  let response = UrlFetchApp.fetch(endpoint, options).getContentText();
  let responseData = JSON.parse(response);

  let accessToken = responseData["access_token"];

  return accessToken;
}
