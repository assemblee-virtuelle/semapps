export interface TypeRegistration {
  types: string[];
  uri: string;
  isPrivate: boolean;
  isContainer: boolean;
}

export interface NotificationChannel {
  id: string;
  topic: string;
  sendTo: string;
  receiveFrom: string;
  webId: string;
}
