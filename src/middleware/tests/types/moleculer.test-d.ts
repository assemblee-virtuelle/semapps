import { ServiceSchema, ActionSchema } from 'moleculer';
import { expectTypeOf } from 'expect-type';

const actionWithComplexParam = {
  params: {
    optionalParam: { type: 'string', optional: true },
    defaultParam: { type: 'string', default: 'default value' },
    stringParam: { type: 'string' },
    stringArrayParam: { type: 'array', items: 'string' },
    objectParam: { type: 'object', props: { o1: { type: 'string' } } },
    multiParam: {
      type: 'multi',
      rules: [{ type: 'string' }, { type: 'object', props: { stringParam: { type: 'string' } } }]
    }
  },
  handler(ctx) {
    expectTypeOf(ctx.params).branded.toEqualTypeOf<{
      optionalParam?: string;
      defaultParam?: string;
      stringParam: string;
      stringArrayParam: string[];
      objectParam: { o1: string };
      multiParam: string | { stringParam: string };
    }>();

    return null;
  }
} satisfies ActionSchema;

const testService1 = {
  name: 'test-service1' as const,
  actions: {
    actionWithStringParamReturns2: {
      params: { stringParam: { type: 'string' } },
      handler(ctx) {
        // Here, ctx.params cannot be inferred because `params` can't be bound to `handler` without a defineAction function.
        // expectTypeOf(ctx.params).toExtend<{ stringParam: string }>();

        return 2 as const;
      }
    },
    actionWithHandlerReturningNum(ctx) {
      return 23 as number;
    },

    // @ts-expect-error TS(2322): Type 'ActionSchema<{ optionalParam: { type: "strin... Remove this comment to see the full error message
    actionWithComplexParam
  }
} satisfies ServiceSchema;

const testVersionedService2 = {
  name: 'test-service2-versioned' as const,
  version: 2 as const, // Version as number
  actions: {
    actionWithStringParamReturnsNum: {
      params: { stringParam: { type: 'string' } },
      handler(ctx) {
        // @ts-expect-error TS(2344): Type '{ stringParam: string; }' does not satisfy t... Remove this comment to see the full error message
        expectTypeOf(ctx.params).toExtend<{ stringParam: string }>();

        const number: number = 2;
        return number;
      }
    },
    actionWithoutParamsReturnsStringArr: {
      handler() {
        return [''];
      }
    }
  }
} satisfies ServiceSchema;

const testVersionedService3 = {
  name: 'test-service3-versioned' as const,
  version: 'v3' as const, // Version as string
  actions: {
    actionWithDocumentedNumParamReturnsString: {
      params: {
        /**
         * **You can have documentation here and even parameter renaming is supported. **
         */
        optionalNumParam: { type: 'number', optional: true }
      },
      async handler(ctx) {
        // @ts-expect-error TS(2344): Type '{ optionalNumParam?: number | undefined; }' ... Remove this comment to see the full error message
        expectTypeOf(ctx.params).toEqualTypeOf<{ optionalNumParam?: number }>();

        return 'return value of actionWithNumParamReturnsString';
      }
    }
  }
} satisfies ServiceSchema;

const externalAction = {
  params: {
    length: { type: 'number' }
  },
  async handler(ctx) {
    expectTypeOf(ctx.params).toMatchObjectType<{ length: number }>();

    const { length } = ctx.params;

    return `list was called successfully with length param ${length * 2}`;
  }
} satisfies ActionSchema;

const testService4ExternalAction = {
  name: 'test-service4-external-action' as const,
  actions: {
    // @ts-expect-error TS(2322): Type 'ActionSchema<{ length: { type: "number"; }; ... Remove this comment to see the full error message
    externalAction
  }
} satisfies ServiceSchema;

const testCallService = {
  name: 'test-call-service',
  actions: {
    testAction: {
      params: {},
      async handler(ctx) {
        expectTypeOf(ctx.call('not.registered.returns.any')).toEqualTypeOf<Promise<any>>(); // okay because unknown
        expectTypeOf(ctx.call('odt.registered.returns.any', { val: 18 })).toEqualTypeOf<Promise<any>>(); // okay because unknown

        expectTypeOf(
          await ctx.call('test-service1.actionWithStringParamReturns2', { stringParam: '' })
        ).toEqualTypeOf<2>();
        expectTypeOf(await ctx.call('test-service1.actionWithHandlerReturningNum')).toEqualTypeOf<number>();
        expectTypeOf(
          await ctx.call('test-service1.actionWithComplexParam', {
            multiParam: '',
            objectParam: { o1: '' },
            stringArrayParam: [''],
            stringParam: ''
          })
        ).toEqualTypeOf<null>();

        expectTypeOf(
          ctx.call('v2.test-service2-versioned.actionWithStringParamReturnsNum', { stringParam: 'string value' })
        ).toEqualTypeOf<Promise<number>>();
        expectTypeOf(this.broker.call('v2.test-service2-versioned.actionWithoutParamsReturnsStringArr')).toEqualTypeOf<
          Promise<string[]>
        >();
        expectTypeOf(
          this.broker.call('v3.test-service3-versioned.actionWithDocumentedNumParamReturnsString')
        ).toEqualTypeOf<Promise<string>>(); // Okay because param is optional
        expectTypeOf(
          this.broker.call('v3.test-service3-versioned.actionWithDocumentedNumParamReturnsString', {})
        ).toEqualTypeOf<Promise<string>>(); // Okay because param is optional
        expectTypeOf(
          ctx.call('v3.test-service3-versioned.actionWithDocumentedNumParamReturnsString', {
            optionalNumParam: 2
          })
        ).toEqualTypeOf<Promise<string>>();

        // @ts-expect-error TS(2322): Type 'number' is not assignable to type 'string'.
        await ctx.call('v2.test-service2-versioned.actionWithStringParamReturnsNum', { stringParam: 3 });
        // @ts-expect-error TS(2554): Expected 2-3 arguments, but got 1.
        await ctx.call('v2.test-service2-versioned.actionWithStringParamReturnsNum');
      }
    }
  },
  methods: {
    async m1(v1) {
      expectTypeOf(this.broker.call('test-service4-external-action.externalAction', { length: 2 })).toEqualTypeOf<
        Promise<string>
      >();
    }
  }
} satisfies ServiceSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      serviceKey141: typeof testService1;
      serviceKey147: typeof testVersionedService2;
      serviceKey206: typeof testVersionedService3;
      serviceKey743: typeof testService4ExternalAction;
      serviceKey753: typeof testCallService;
    }
  }
}
