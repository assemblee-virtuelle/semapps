import { Context, ServiceSchema, CallingOptions } from 'moleculer';

interface LocalServerSettings {
  fusekiBase: string | null;
  otherDirsPaths: Record<string, string>;
}

interface RemoteServerSettings {
  path: string | null;
  user?: string | null;
  password?: string | null;
  host?: string | null;
  port?: number | null;
}

interface CronJobSettings {
  time: string | null;
  timeZone?: string;
}

interface BackupServiceSettings {
  localServer: LocalServerSettings;
  copyMethod: 'rsync' | 'ftp' | 'fs';
  remoteServer: RemoteServerSettings;
  cronJob: CronJobSettings;
}

interface BackupServiceActions {
  backupAll: (ctx: Context, opts?: CallingOptions | undefined) => Promise<void>;
  backupDatasets: (ctx: Context, opts?: CallingOptions | undefined) => Promise<void>;
  backupOtherDirs: (ctx: Context, opts?: CallingOptions | undefined) => Promise<void>;
  copyToRemoteServer: (ctx: Context, opts?: CallingOptions | undefined) => Promise<void>;
}

export interface BackupService extends ServiceSchema {
  name: 'backup';
  settings: BackupServiceSettings;
  dependencies: ['triplestore'];
  actions: BackupServiceActions & ServiceSchema['actions'];
}
