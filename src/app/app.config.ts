import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FirestoreModule,  } from '@angular/fire/firestore';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';


const modules = [
  RouterModule.forRoot(routes),
  BrowserAnimationsModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  FirestoreModule,
];

export const providers = [
  importProvidersFrom(modules),
  provideAnimations()
];