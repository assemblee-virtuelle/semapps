const crypto = require('node:crypto');

/**
 * Service to generate challenges upon request.
 * Challenges can be used to created Verifiable Presentations (VC).
 *
 * Challenges are kept in memory and are valid for up to 5 minutes or until they are used.
 * @type {import('moleculer').ServiceSchema}
 */
const ChallengeService = {
  name: 'signature.challenge',
  dependencies: ['api'],
  settings: {
    /** Milliseconds challenges should be valid for. @default 5 minutes */
    challengeExpirationMs: 5 * 60 * 1000
  },
  async started() {
    // Have the format { challenge: {timestamp: new Date()} }
    this.challenges = {};

    // Register route to obtain challenge from.
    await this.broker.call('api.addRoute', {
      route: {
        name: 'create-challenge-endpoint',
        path: '/api/v1/vc/challenges',
        authorization: false,
        authentication: false,
        aliases: {
          'POST /': 'signature.challenge.createChallenge'
        }
      }
    });

    // TODO: Add VC API discovery in WebId / CID document.
    // This requires to add the triples to the webId doc
    // and it requires the context to be updated.
  },
  actions: {
    createChallenge() {
      if (!this.cleanupTimerSetUp) {
        this.startCleanupTimer();
      }

      const challenge = crypto.randomUUID();
      this.challenges[challenge] = { issued: Date.now() };

      return { challenge };
    },

    getAllChallenges() {
      return this.challenges;
    },

    clearChallenges() {
      this.challenges = {};
    },

    validateChallenge(ctx) {
      const { challenge } = ctx.params;

      // Does challenge exist?
      if (!this.challenges[challenge]) {
        return { valid: false, error: new Error('Challenge not found or has expired.') };
      }

      // Is challenge expired?
      if (Date.now() - this.challenges[challenge].issued > this.settings.challengeExpirationMs) {
        delete this.challenges[challenge];
        return { valid: false, error: new Error('Challenge not found or has expired.') };
      }

      delete this.challenges[challenge];

      return { valid: true };
    },

    cleanOldChallenges() {
      const now = Date.now();
      for (const [challenge, { issued }] of Object.entries(this.challenges)) {
        if (now - issued > this.settings.challengeExpirationMs) {
          delete this.challenges[challenge];
        }
      }
    }
  },
  methods: {
    startCleanupTimer() {
      this.cleanupTimerSetUp = true;

      // If timer service is available, schedule timer.
      if (this.broker.getLocalService('timer')) {
        this.broker.call('timer.set', {
          key: 'challengeCleanup',
          time: Date.now() + this.settings.challengeExpirationMs,
          actionName: 'signature.challenge.cleanOldChallenges',
          repeat: this.settings.challengeExpirationMs
        });
      } else {
        // Set up `setInterval`-based solution.
        setInterval(() => {
          this.actions.cleanOldChallenges();
          this.cleanupTimerSetUp = false;
        }, this.settings.challengeExpirationMs);
      }
    }
  }
};

module.exports = ChallengeService;
