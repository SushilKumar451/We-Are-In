import React from 'react';
import Datamap from 'react-datamaps';

const VMSDataMap = ({ data }) => {
  const radius = 4;
  const bubbleData = data.map((x) => {
    return {
      name: x.name || '',
      radius,
      country: x.country || '',
      latitude: x.latitude || 0.0,
      longitude: x.longitude || 0.0,
      fillKey: 'bubbleFill',
    };
  });

  return (
    <Datamap
      responsive
      geographyConfig={{
        popupOnHover: false,
        highlightOnHover: false,
      }}
      fills={{
        defaultFill: '#abdda4',
        bubbleFill: 'red',
      }}
      bubbles={bubbleData}
      bubbleOptions={{
        borderWidth: 1,
        borderColor: '#ABCDEF',
      }}
    />
  );
};

export default VMSDataMap;
