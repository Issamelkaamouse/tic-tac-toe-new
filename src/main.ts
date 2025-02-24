import { bootstrapApplication, platformBrowser } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { providers } from "./app/app.config";


bootstrapApplication(AppComponent, { providers })
  .catch(console.error);