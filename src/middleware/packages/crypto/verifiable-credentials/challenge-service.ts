import crypto from 'node:crypto';
import { ServiceSchema, defineAction } from 'moleculer';

/**
 * Service to generate challenges upon request.
 * Challenges can be used to created Verifiable Presentations (VC).
 *
 * Challenges are kept in memory and are valid for up to 5 minutes or until they are used.
 * @type {import('moleculer').ServiceSchema}
 */
const ChallengeService = {
  name: 'crypto.vc.presentation.challenge' as const,
  settings: {
    /** Milliseconds challenges should be valid for. @default 5 minutes */
    challengeExpirationMs: 5 * 60 * 1000
  },
  async started() {
    // Have the format { challenge: {timestamp: new Date()} }
    this.challenges = {};
  },
  actions: {
    create: defineAction({
      handler() {
        if (!this.cleanupTimerSetUp) {
          // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
          this.startCleanupTimer();
        }

        const challenge = crypto.randomUUID();
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.challenges[challenge] = { issued: Date.now() };

        return { challenge };
      }
    }),

    getAll: defineAction({
      handler() {
        return this.challenges;
      }
    }),

    clearAll: defineAction({
      handler() {
        this.challenges = {};
      }
    }),

    validate: defineAction({
      handler(ctx) {
        const { challenge } = ctx.params;

        // Does challenge exist?
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (!this.challenges[challenge]) {
          return { valid: false, error: new Error('Challenge not found or has expired.') };
        }

        // Is challenge expired?
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        if (Date.now() - this.challenges[challenge].issued > this.settings.challengeExpirationMs) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          delete this.challenges[challenge];
          return { valid: false, error: new Error('Challenge not found or has expired.') };
        }

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        delete this.challenges[challenge];

        return { valid: true };
      }
    }),

    cleanElapsed: defineAction({
      handler() {
        const now = Date.now();
        // @ts-expect-error TS(2769): No overload matches this call.
        for (const [challenge, { issued }] of Object.entries(this.challenges)) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          if (now - issued > this.settings.challengeExpirationMs) {
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            delete this.challenges[challenge];
          }
        }
      }
    })
  },
  methods: {
    startCleanupTimer() {
      this.cleanupTimerSetUp = true;

      // If timer service is available, schedule timer.
      if (this.broker.getLocalService('timer')) {
        this.broker.call('timer.set', {
          key: 'challengeCleanup',
          time: Date.now() + this.settings.challengeExpirationMs,
          actionName: 'crypto.vc.presentation.challenge.cleanElapsed',
          repeat: this.settings.challengeExpirationMs
        });
      } else {
        // Set up `setInterval`-based solution.
        setInterval(() => {
          this.actions.cleanElapsed();
          this.cleanupTimerSetUp = false;
        }, this.settings.challengeExpirationMs);
      }
    }
  }
} satisfies ServiceSchema;

export default ChallengeService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ChallengeService.name]: typeof ChallengeService;
    }
  }
}
