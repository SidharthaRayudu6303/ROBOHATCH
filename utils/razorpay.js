/**
 * Razorpay Script Loader
 * 🔒 SECURITY NOTE: This loads third-party script from Razorpay CDN
 * ⚠️ For maximum security, use Next.js Script component in pages instead
 * 
 * @deprecated Use <Script> component in payment page instead
 * @returns {Promise<boolean>} True if loaded successfully
 */
export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined') {
      resolve(true);
      return;
    }

    // Create script element with security attributes
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.crossOrigin = 'anonymous'; // Enable CORS for error reporting
    
    script.onload = () => {
      console.log('✅ Razorpay SDK loaded successfully');
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

