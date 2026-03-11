import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { BaseResponseInterceptor } from './core/interceptors/base-response.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { WebSocketService } from './core/services/websocket/websocket.service';
import { AnalyticsService } from './core/services/analytics/analytics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([AuthInterceptor, BaseResponseInterceptor, errorInterceptor])),
    WebSocketService,
    AnalyticsService,
    provideAnimations()
  ]
};
