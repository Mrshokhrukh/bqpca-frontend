// scrollbar-fix-plugin.js
export default function ({ addBase }) {
  addBase({
    // Base html/body fixes
    'html, body': {
      height: '100%',
      overflowY: 'auto !important', // Allow vertical scrolling
      overflowX: 'hidden !important', // Prevent horizontal scrolling
      WebkitOverflowScrolling: 'touch',
    },

    // Fix for authenticated pages
    '.max-w-6xl': {
      height: 'calc(100vh - 80px)',
      overflowY: 'auto !important',
      overflowX: 'hidden !important',
      WebkitOverflowScrolling: 'touch',
      display: 'flex',
      flexDirection: 'column',
    },

    // Fix for landing page
    '.min-h-screen': {
      overflowY: 'auto !important',
      overflowX: 'hidden !important',
      WebkitOverflowScrolling: 'touch',
    },

    // Fix container widths to prevent horizontal overflow
    '.container': {
      maxWidth: '100% !important',
    },

    // Handle forms on both page types
    '.max-w-6xl > form, .min-h-screen > div': {
      overflow: 'visible !important',
      maxWidth: '100%',
    },

    // Fix overflow issues on flex containers
    '.flex-1.overflow-y-auto, .overflow-auto': {
      overflowX: 'hidden !important',
    },

    // Modal specific fixes
    '.fixed.inset-0.z-10.w-screen.overflow-y-auto, .fixed.inset-0': {
      overflow: 'hidden !important',
    },

    '.fixed.inset-0.z-10.w-screen.overflow-y-auto > div, .fixed.inset-0 > div': {
      maxHeight: '90vh',
      overflowY: 'auto !important',
      overflowX: 'hidden !important',
    },

    // Safari-specific fixes
    '@media not all and (min-resolution:.001dpcm)': {
      '@supports (-webkit-appearance:none)': {
        body: {
          overflowY: 'scroll !important',
          overflowX: 'hidden !important',
        },
        '.min-h-screen, .max-w-6xl': {
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100vw',
        },
        // Ensure scroll behavior persists after page transitions
        '[data-v-app]': {
          minHeight: '100vh',
          overflowY: 'auto !important',
          overflowX: 'hidden !important',
        },
      },
    },
  })
}
