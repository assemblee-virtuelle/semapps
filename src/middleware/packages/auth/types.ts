export interface Account {
  '@id': string;
  username: string;
  hashedPassword?: string;
  resetPasswordToken?: string;
  email: string;
  webId: string;
  version?: string;
}
