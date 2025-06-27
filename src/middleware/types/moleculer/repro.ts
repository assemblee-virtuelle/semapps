/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */

// Reproduction

interface AllServices {}
interface AllServices {
  S1: { name: 's1'; actions: { a1: (s1p: string) => 1.1 } };
}
interface AllServices {
  S2: { name: 's2'; actions: { a2: (s2p: string) => '2' } };
}
interface AllServices {
  S3: {
    name: 's3';
    actions: {
      a3: typeof a3Action;
      a4: typeof a4Action;
    };
  };
}

//
//
const a3Action = defineAction({
  params: { a3p: { type: 'string' } },
  handler: async ctx => {
    const ps = ctx.params;

    const a3Result: number = await ctx.call('a4', { a3p: '' });

    return ps.a3p;
  }
});
const a4Action = {
  params: { a3p: { type: 'string' } },
  handler: async ctx => {
    const ps = ctx.params;
    const a3Result: string = await ctx.call('a3');
    return 3;
  }
} satisfies ActionSchema;

//
//
function defineAction<
  const Schema extends ValidatorSchema,
  const Handler extends ActionHandler<TypeFromSchema<Schema>>
>(schema: ActionSchema<Schema, Handler>): ActionSchema<Schema, Handler>;

type ServiceKey = keyof AllServices;
type ServiceName = AllServices[ServiceKey]['name'];

type AllActions = UnionToIntersect<ActionOfService<AllServices>>;
type ActionName = keyof AllActions;

type ActionOfService<Services extends AllServices> = {
  [SK in keyof Services]: {
    [A in keyof Services[SK]['actions'] as A & string]: Services[SK]['actions'][A];
  };
}[keyof Services];

type Call<Meta extends any = any> = <AName extends ActionName = ActionName, Action = AllActions[AName]>(
  actionName: AName,
  ...args: AName extends keyof AllActions
    ? HasAtLeastOneRequiredParam<Action> extends true
      ? [params: ParamTypeOfAction<Action>, opts?: CallingOptions<Meta>]
      : [params?: ParamTypeOfAction<Action>, opts?: CallingOptions<Meta>]
    : [params?: Record<string, any>, opts?: CallingOptions<Meta>]
) => Promisify<AName extends keyof AllActions ? ReturnType<HandlerOfAction<Action>> : unknown>;

class Context<Params extends Record<string, any> = Record<string, any>> {
  params: Params;
  call: Call;
}

/** A schema like: `{p1: {type: "string"}, p2: {type: "boolean"}}` */
type ValidatorSchema = Record<string, ParameterSchema>;

/** Schema of a single parameter, like `{type: "boolean", optional: true}` */
type ParameterSchema<DefaultType extends any = undefined> = (
  | { optional?: true }
  | { default?: DefaultType } // TODO: Bind this to the allowable schema definitions.
) &
  (
    | { type: 'multi'; rules: ParameterSchema[] }
    | { type: 'object'; params: Record<string, ParameterSchema> }
    | { type: 'array'; items: keyof BasicValidatorTypeMap }
    | { type: keyof BasicValidatorTypeMap }
  );

/*
 * # INFERENCE TYPES
 */

/** Infers the object type from a FastestValidator schema. */
type TypeFromSchema<Schema extends ValidatorSchema> = Schema extends ValidatorSchema
  ? {
      [Param in keyof Schema]: TypeFromSchemaParam<Schema[Param]>;
    }
  : never;

/** Infers type from fastest-validator schema property definition. */
type TypeFromSchemaParam<Param extends ParameterSchema> =
  // Base type inferred from the `type` property
  | TypeFromParsedParam<
      Param['type'],
      // @ts-expect-error TS(2344): Type 'Param["items"]' does not satisfy the constra... Remove this comment to see the full error message
      Param['items'], // 'items' extends keyof Param ? Extract<Param['items'], string>: undefined, // Present for arrays.
      // @ts-expect-error TS(2536): Type '"params"' cannot be used to index type 'Para... Remove this comment to see the full error message
      Param['params'], // 'params' extends keyof Param ? Param['params']: undefined, // Present for objects.
      // @ts-expect-error TS(2536): Type '"rules"' cannot be used to index type 'Param... Remove this comment to see the full error message
      Param['rules'] // 'rules' extends keyof Param ? Param['rules']: undefined // Present for objects with multiple possible types.
    >
  // Include the type of `default` if it exists
  | (Param extends { default: infer D } ? D & {} : never)
  // Include `undefined` if `optional` is true
  | (Param extends { optional: true } ? undefined : never);

/** Infers the type from a fastest-validator string type and processes array, object or multi parameters, if provided. */
type TypeFromParsedParam<
  T extends string, // The basic type as string.
  ItemTypeValue extends string = never, // If items property is present for array type.
  ObjectSchema extends ParameterSchema = never, // ...
  MultiTypeSchemas extends ParameterSchema[] = never // ...
> = T extends keyof BasicValidatorTypeMap
  ? BasicValidatorTypeMap[T]
  : T extends 'array'
    ? Array<TypeFromParsedParam<ItemTypeValue>>
    : T extends 'multi'
      ? MultiType<MultiTypeSchemas>
      : T extends 'object'
        ? TypeFromSchema<ObjectSchema>
        : never;

/** Fastest-validator types with primitive mapping.  */
// When making this extend Record<string, any>, TS is running into weird recursions.
interface BasicValidatorTypeMap {
  any: any;
  boolean: boolean;
  class: any;
  currency: string;
  custom: any;
  date: string;
  email: string;
  equal: any;
  forbidden: any;
  function: Function;
  luhn: string;
  mac: string;
  number: number;
  objectID: any;
  record: object;
  string: string;
  tuple: Array<unknown>;
  url: string;
  uuid: string;
}

/** Infers schema definitions from an array of schema properties into one type. */
type MultiType<ParameterSchemas extends ParameterSchema[] = []> = {
  [Index in keyof ParameterSchemas]: TypeFromSchemaParam<ParameterSchemas[Index]>;
}[number];

/** Converts a type union into a type intersection */
type UnionToIntersect<T> = (T extends any ? (x: T) => 0 : never) extends (x: infer R) => 0 ? R : never;

/** The following type wraps an object in a promise if it isn't one already. */
type Promisify<O> = O extends Promise<any> ? O : Promise<O>;

/** Get the parameter type of an action, if it exists. */
type ParamTypeOfAction<Action extends ActionHandler | ActionSchema> = 'params' extends keyof Action
  ? TypeFromSchema<Action['params']>
  : unknown;

/** Handler function from Handler (which can be a function or a action definitions). */
type HandlerOfAction<Action extends ActionHandler | ActionSchema> = Action extends ActionHandler
  ? Action
  : 'handler' extends keyof Action
    ? Action['handler']
    : never;

//
// Call Functions

/** Helper to check if an object type has at least one non-optional property. */
type HasRequiredKeys<T> = [
  keyof {
    // Pick only keys that do not include undefined in their type.
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
  }
] extends [never]
  ? false
  : true;

/** Decides if an action has at least one required (non-optional) param. */
type HasAtLeastOneRequiredParam<A extends ActionHandler | ActionSchema> =
  ParamTypeOfAction<A> extends infer P
    ? [unknown] extends [P]
      ? false
      : [keyof P] extends [never]
        ? false
        : HasRequiredKeys<P>
    : false;

/**
 * Infers the parameter type required by a given action. If the action requires at least one parameter,
 * it is mandatory; otherwise, it is optional.
 */
type ParamForAction<A extends ActionSchema | ActionHandler> =
  HasAtLeastOneRequiredParam<A> extends true ? ParamTypeOfAction<A> : ParamTypeOfAction<A> | undefined;

// To make the return type of ActionHandlerFn be inferred at call-time, you can remove the explicit R parameter from the function definition and let TypeScript infer it from the function implementation or usage.
// Alternatively, you can use a generic function signature and let the type be inferred from the return statement.

type ActionHandler<Params extends Record<string, any> = Record<string, any>> = (ctx: Context<Params>) => any;

// ActionSchema base interface for explicit properties
interface ActionSchemaBase<
  ParamSchema extends ValidatorSchema = ValidatorSchema,
  Handler extends ActionHandler<TypeFromSchema<ParamSchema>> = ActionHandler<TypeFromSchema<ParamSchema>>
> {
  name?: string;
  params?: ParamSchema;
  handler: Handler;
}

// ActionSchema type with mapped type for extra properties (excluding 'params')
type ActionSchema<
  ParamSchema extends ValidatorSchema = ValidatorSchema,
  Handler extends ActionHandler<TypeFromSchema<ParamSchema>> = ActionHandler<TypeFromSchema<ParamSchema>>
> = ActionSchemaBase<ParamSchema, Handler> & {
  // See https://github.com/moleculerjs/moleculer/issues/467#issuecomment-705583471
  [key: string]: string | boolean | any[] | number | Record<any, any> | null | undefined;
};
