import { initApplication, gracefulShutdown } from './application';

initApplication();

// handle graceful shutdown
// - closing http server
// - closing TCP connection
gracefulShutdown();
