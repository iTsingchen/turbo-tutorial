module.exports = {
  extends: require.resolve("@turbo-tutorial/eslint/nextjs.eslintrc"), // Must use require.resolve
  parserOptions: {
    root: true,
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname, // https://github.com/typescript-eslint/typescript-eslint/issues/251
  },
};
