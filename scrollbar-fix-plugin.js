// scrollbar-fix-plugin.js - FINAL VERSION
export default function ({ addBase }) {
  addBase({
    // Target only Safari browsers with this nested media query
    '@media not all and (min-resolution:.001dpcm)': {
      '@supports (-webkit-appearance:none)': {
        // Critical - ensure body always has scroll capability in Safari
        'html, body': {
          height: '100%',
          overflowY: 'auto !important',
          '-webkit-overflow-scrolling': 'touch',
        },

        // This targets the Vue app root - critical for maintaining scroll after logout
        '#app, [data-v-app]': {
          minHeight: '100vh',
          overflowY: 'auto !important',
          '-webkit-overflow-scrolling': 'touch',
        },

        // Landing page specific fix
        '.min-h-screen': {
          overflowY: 'auto !important',
          '-webkit-overflow-scrolling': 'touch',
          overflowX: 'hidden',
        },

        // Fix double scrollbars in authenticated pages
        '.max-w-6xl': {
          height: 'calc(100vh - 80px)',
          overflowY: 'auto !important',
          overflowX: 'hidden',
          '-webkit-overflow-scrolling': 'touch',
        },

        // Fix for nested scrollable elements
        '.p-8, .bg-white.border, .bg-gray-50': {
          overflow: 'visible !important',
        },

        // Modal fixes
        '.fixed.inset-0.z-10.w-screen.overflow-y-auto, .fixed.inset-0': {
          overflow: 'hidden !important',
        },

        '.fixed.inset-0 > div, .fixed.inset-0.z-10.w-screen.overflow-y-auto > div': {
          maxHeight: '90vh',
          overflowY: 'auto !important',
          overflowX: 'hidden',
        },
      },
    },
  })
}
