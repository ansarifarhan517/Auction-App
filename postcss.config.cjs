module.exports = {
  // Use explicit require() so PostCSS gets plugin functions rather than name-keys
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
}
