// Preload: fix DNS for MongoDB Atlas SRV resolution
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

// Global error handlers to catch and log crashes
process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION:', err.stack || err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🌊 UNHANDLED REJECTION:', reason);
});

// DEEP Monkey-patch diagnostics_channel to prevent Node 24 crash
try {
    const dc = require('diagnostics_channel');
    dc.TracingChannel = class TracingChannel {
        constructor() { this.id = 'noop'; }
        subscribe() { }
        unsubscribe() { }
        traceSync(fn, c, r, t, a) { return fn.apply(t, a); }
        traceCallback(fn) { return fn; }
        tracePromise(fn, c, r, t, a) { return fn.apply(t, a); }
    };
    const dummy = { subscribe: () => { }, unsubscribe: () => { }, publish: () => { }, hasSubscribers: false };
    dc.channel = () => dummy;
    console.log('🛡️  Diagnostics Channel No-Op Patch Applied');
} catch (e) {
    console.log('⚠️  Diagnostics patch failed:', e.message);
}
