// helperFunctions.js

// Removes HTML Tags from a string.
export const removeHtmlTags = htmlString => {
  return htmlString.replace(/<[^>]+>/g, '');
};
