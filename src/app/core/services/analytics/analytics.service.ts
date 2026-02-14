import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  trackEvent(eventName: string, properties?: { [key: string]: any }) {
    // In a real application, this would integrate with a third-party analytics tool (e.g., Google Analytics, Amplitude, Mixpanel)
    // For now, we'll just log to the console to simulate tracking.
    console.log(`Analytics Event: ${eventName}`, properties ? properties : '');
  }
}
