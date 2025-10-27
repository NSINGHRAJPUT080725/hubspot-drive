// This file can be used to store Google API related helper functions.

export const getGoogleDriveFolderIdFromUrl = (url) => {
  const match = url.match(/folders\/([\w-]+)/);
  return match ? match[1] : null;
};
