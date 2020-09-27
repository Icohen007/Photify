export const filters = [
  {
    description: 'Blur',
    filterType: 'blur',
    range: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 0,
    },
  },
  {
    description: 'Grayscale',
    filterType: 'grayscale',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    description: 'Invert',
    filterType: 'invert',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    description: 'Sepia',
    filterType: 'sepia',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0,
    },
  },
  {
    description: 'Hue-rotate',
    filterType: 'hue-rotate',
    range: {
      min: 0,
      max: 360,
      step: 1,
      defaultValue: 0,
    },
  },
  {
    description: 'Opacity',
    filterType: 'opacity',
    range: {
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 1,
    },
  },
  {
    description: 'Brightness',
    filterType: 'brightness',
    range: {
      min: 0,
      max: 2,
      step: 0.01,
      defaultValue: 1,
    },
  },
  {
    description: 'Contrast',
    filterType: 'contrast',
    range: {
      min: 0,
      max: 2,
      step: 0.01,
      defaultValue: 1,
    },
  },
  {
    description: 'Saturation',
    filterType: 'saturate',
    range: {
      min: 0,
      max: 2,
      step: 0.01,
      defaultValue: 1,
    },
  },
];

export const defaultFilterValues = filters.reduce((acc, cur) => {
  acc[cur.filterType] = cur.range.defaultValue;
  return acc;
}, {});
