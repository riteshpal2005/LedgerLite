jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    __esModule: true,
    ...Reanimated,
    FadeInDown: {
      duration: () => ({
        springify: () => ({
          delay: () => ({
            duration: () => ({
              springify: () => ({})
            })
          })
        })
      }),
      delay: () => ({
        duration: () => ({
          springify: () => ({})
        })
      })
    }
  };
});
