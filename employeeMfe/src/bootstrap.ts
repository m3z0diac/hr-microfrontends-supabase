import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import 'zone.js';

(async () => {
  const app = await createApplication(appConfig);

  const employeeElement = createCustomElement(AppComponent, {
    injector: app.injector,
  });

  if (!customElements.get('employee-root')) {
    customElements.define('employee-root', employeeElement);
  }
})();
