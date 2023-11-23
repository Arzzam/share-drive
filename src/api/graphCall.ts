export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  driveEndpoint: `https://graph.microft.com/v1.0/me/drive/items/root:/`,
};

export async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
