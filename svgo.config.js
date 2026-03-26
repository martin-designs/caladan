module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Clean up IDs to prevent conflicts when using multiple icons
          cleanupIds: true,
        },
      },
    },
    // Keep viewBox so icons scale properly
    {
      name: 'removeViewBox',
      active: false,
    },
    // Replace hardcoded fill colors with currentColor
    // so icons inherit color from CSS
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
    // Remove unused defs
    {
      name: 'removeUselessDefs',
    },
  ],
};
