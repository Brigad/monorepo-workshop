import { Dimensions } from 'react-native';

const width = Dimensions.get('screen').width;

export const getScreenWidth = () => {
  return width;
}