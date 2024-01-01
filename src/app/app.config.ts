import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './interceptors/api.interceptor';
import { DatePipe } from '@angular/common';
import {  provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,withViewTransitions()),provideAnimations(),DatePipe,provideHttpClient(withFetch(),withInterceptors([apiInterceptor])), provideClientHydration()]
};
