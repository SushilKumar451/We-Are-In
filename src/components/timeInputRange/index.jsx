import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

const TimeInputRange = ({
  value,
  onChange,
  onChangeComplete,
  disabled = false,
}) => {
  return (
    <InputRange
      draggableTrack
      maxValue={24}
      formatLabel={(value) => value.toFixed(2)}
      minValue={6}
      onChange={onChange}
      onChangeComplete={onChangeComplete}
      value={value}
      disabled={disabled}
      allowSameValues={true}
    />
  );
};

export default TimeInputRange;
