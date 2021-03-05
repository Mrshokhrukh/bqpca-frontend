// scrollbar-fix-plugin.js
export default function ({ addBase }) {
  addBase({
    // Target only Safari browsers with this nested media query
    '@media not all and (min-resolution:.001dpcm)': {
      '@supports (-webkit-appearance:none)': {
        // Fix double scrollbars in authenticated pages
        '.max-w-6xl': {
          height: 'calc(100vh - 80px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          '-webkit-overflow-scrolling': 'touch',
          position: 'relative',
        },

        // Ensure scroll persists after navigation
        body: {
          '-webkit-overflow-scrolling': 'touch',
        },

        // Fix landing page scrolling
        '.min-h-screen': {
          '-webkit-overflow-scrolling': 'touch',
          overflowX: 'hidden',
        },

        // Fix for nested scrollable elements
        '.p-8, .bg-white.border, .bg-gray-50': {
          overflow: 'visible !important',
        },

        // Modal fixes
        '.fixed.inset-0.z-10.w-screen.overflow-y-auto': {
          overflow: 'hidden !important',
        },

        '.fixed.inset-0 > div': {
          maxHeight: '90vh',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      },
    },
  })
}
