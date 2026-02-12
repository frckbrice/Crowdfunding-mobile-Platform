import type { ImageSourcePropType } from 'react-native';

const profile = require('../assets/images/profile.png');
const path = require('../assets/images/path.png');
const empty = require('../assets/images/empty.png');

const images = {
  profile,
  path,
  empty,
} as const satisfies Record<string, ImageSourcePropType>;

export default images;
