require('./dns-fix');
const path = require('path');

const originalRequire = module.constructor.prototype.require;
module.constructor.prototype.require = function (modulePath) {
    const resolvedPath = path.basename(modulePath);
    if (!modulePath.startsWith('node:')) {
        console.log(`🔍 Loading: ${modulePath}`);
    }
    try {
        const result = originalRequire.apply(this, arguments);
        if (!modulePath.startsWith('node:')) {
            console.log(`✅ Loaded: ${modulePath}`);
        }
        return result;
    } catch (e) {
        console.error(`❌ FAILED to load ${modulePath}`);
        throw e;
    }
};

console.log('🚀 Starting Debug Wrapper...');
try {
    require('./dist/index');
    console.log('🎉 Server entry point reached!');
} catch (e) {
    console.error('🔥 CRASH DURING REQUIRE:', e.stack || e);
}
