const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Normal case: .env in the current working directory (local dev, or a host
// where the working directory is stable).
dotenv.config();

// Fallback for hosts like Hostinger's Git-deploy, where the app's working
// directory is recreated from scratch on every redeploy, so anything saved
// there (including a manually-created .env) is wiped each time. Scripts run
// by hand over SSH (db:schema, db:seed) still need real credentials, so
// also check a fixed path in the account's home directory that redeploys
// never touch. dotenv.config() never overwrites a variable that's already
// set, so this only fills in whatever the first pass above didn't provide.
//
// Create this file ONCE, ever — see README "Persistent env for SSH scripts".
const persistentEnvPath = process.env.PERSISTENT_ENV_PATH || path.join(os.homedir(), '.denco-india.env');
if (fs.existsSync(persistentEnvPath)) {
  dotenv.config({ path: persistentEnvPath });
}
