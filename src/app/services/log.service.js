import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

function init() {
  Sentry.init({
    dsn: "https://b90d72a4557b4d57a15909b007a3c8c2@o4504221198254080.ingest.sentry.io/4504221220077568",
    integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}
function log(error) {
  Sentry.captureException(error);
}
const logger = {
  init,
  log,
};
export default logger;
