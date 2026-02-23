require('./dns-fix');
try {
    console.log('🚀 Loading application entry point...');
    require('./dist/index');
    console.log('✅ Entry point loaded (async start pending)');
} catch (e) {
    console.error('🔥 CRITICAL STARTUP ERROR:', e.stack || e);
    process.exit(1);
}
