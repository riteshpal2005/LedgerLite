module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require("nativewind/preset")], // <--- Add this line!
  theme: {
    extend: {},
  },
  plugins: [],
}
