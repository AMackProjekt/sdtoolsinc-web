'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log Core Web Vitals to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    }
    
    // In production, you could send this to an analytics service
    // Example: window.gtag?.('event', metric.name, { value: metric.value });
    // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(metric) });
  });

  return null;
}
