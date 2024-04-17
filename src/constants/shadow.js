export const createShadow = colorSet => ({
  shadowColor: colorSet.shadowColor,
  shadowOffset: {width: 0, height: 1},
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: colorSet === 'light' ? 3 : 0,
});
