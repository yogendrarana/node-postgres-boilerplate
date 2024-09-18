import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export const configureSentry = () => {   
    Sentry.init({
            dsn: process.env.SENTRY_DSN,
        integrations: [
            nodeProfilingIntegration(),
        ],
        
        debug: true,
        attachStacktrace: true,
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
    });
}

export default Sentry;
