import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; // Correct import for the root component

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
