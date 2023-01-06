export const buildUrl = (baseUrl, endpoint) => {
  try {
    return new URL(endpoint, baseUrl).href;
  } catch (error) {
    // TODO: Handle error
    return '';
  }
};
