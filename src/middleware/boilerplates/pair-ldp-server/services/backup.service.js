const path = require('path');
const BackupService = require('@semapps/backup');
const CONFIG = require('../config');

module.exports = {
  mixins: [BackupService],
  settings: {
    localServer: {
      fusekiBackupsPath: CONFIG.BACKUP_FUSEKI_DATASETS_PATH,
      uploadsPath: path.resolve(__dirname, '../uploads')
    },
    // Rsync
    remoteServer: {
      user: CONFIG.BACKUP_SERVER_USER,
      password: CONFIG.BACKUP_SERVER_PASSWORD,
      host: CONFIG.BACKUP_SERVER_HOST,
      path: CONFIG.BACKUP_SERVER_PATH
    },
    cronJob: {
      time: '0 0 4 * * *', // Every night at 4am
      timeZone: 'Europe/Paris',
      dataset: CONFIG.MAIN_DATASET
    }
  }
};
