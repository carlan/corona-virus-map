const listMapData = async () => {
  const response = await fetch('http://localhost:4000/map-data');

  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

  throw new Error(response.statusText);
};

export default listMapData;