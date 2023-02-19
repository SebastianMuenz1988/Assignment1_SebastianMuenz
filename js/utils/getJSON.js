export async function getJSON(url) {
  // read the json from our route/url
  let rawData = await fetch(url); // --> response object
  // unpack/deserialize the json int a javascript data structure
  let data = await rawData.json(); // --> array of objects
  // the same as: await (await fetch('./persons.json)')).json();
  return data;
}
