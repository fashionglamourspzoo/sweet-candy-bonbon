module.exports = {
  preset: 'react-native',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-svg|react-native-linear-gradient|lucide-react-native)/)',
  ],
};
