// mac-scrollbar-fix-plugin.js
export default function({ addBase }) {
    addBase({
      // Only target Safari/WebKit browsers with this special nested media query
      '@media not all and (min-resolution:.001dpcm)': {
        '@supports (-webkit-appearance:none)': {
          // Fix for body to maintain scroll after navigation
          'body': {
            overflowY: 'scroll !important',
            overflowX: 'hidden !important'
          },
          
          // Fix for authenticated pages container
          '.max-w-6xl': {
            height: 'calc(100vh - 80px)',
            WebkitOverflowScrolling: 'touch',
            position: 'relative'
          },
          
          // Fix for landing page
          '.min-h-screen': {
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            maxWidth: '100vw'
          },
          
          // Specifically for Vue app container
          '[data-v-app]': {
            minHeight: '100vh',
            WebkitOverflowScrolling: 'touch'
          },
          
          // Fix for any modals in Safari
          '.fixed.inset-0 > div': {
            maxHeight: '90vh',
            overflowY: 'auto'
          }
        }
      }
    });
  };