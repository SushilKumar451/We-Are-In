const resolve = (data) => {
  if (!data || !data.length) return [];

  const list = data.map((x) => {
    return {
      name: x.country,
      country: x.countryCode || '',
      latitude: x.lat_long.lat,
      longitude: x.lat_long.long,
    };
  });
  return list;
};

export default {
  resolve,
};