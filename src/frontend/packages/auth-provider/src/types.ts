export type AclMode = 'acl:Read' | 'acl:Append' | 'acl:Write' | 'acl:Control';

/** foaf:Agent = anonymous, acl:AuthenticatedAgent = logged */
export type AclClass = 'foaf:Agent' | 'acl:AuthenticatedAgent';

export interface PasswordAnalysis {
  score: number;
  suggestions: string[];
  missingCriteria: {
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    special: boolean;
    length: boolean;
    veryLong: boolean;
  };
}

type BasePermission = {
  /** '#Control' | '#Read' | '#Write' | custom string */
  '@id': string;
  '@type': 'acl:Authorization';
  'acl:mode': AclMode;
} & (
  | {
      /** Related resource URI */
      'acl:accessTo'?: string;
    }
  | {
      /** Parent resource URI */
      'acl:default': string;
    }
);

type UserPermission = BasePermission & {
  /** User resource URI */
  'acl:agent': string;
};

type GroupPermission = BasePermission & {
  /** ACL Group resource URI */
  'acl:agentGroup': string;
};

type ClassPermission = BasePermission & {
  'acl:agentClass': AclClass | AclClass[];
};

type Permission = UserPermission | GroupPermission | ClassPermission;

export type Permissions = Permission[];
