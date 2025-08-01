/**
 * Replace moleculer-bull QueueMixin if Redis is not available
 * Call immediately jobs instead of putting them in a queue.
 * Bull's many queue options are of course not taken into account
 * See https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-bull#readme
 */
const FakeQueueMixin = {
  methods: {
    async createJob(queueName, jobName, data, opts) {
      this.logger.warn(`QueueMixin not configured, calling job directly`);
      if (!this.schema.queues[queueName]) throw new Error(`No queue found with key ${queueName}`);
      try {
        // TODO add all job properties https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#job
        await this.schema.queues[queueName].process.bind(this)({
          data,
          log: (...args) => {
            this.logger.info(...args);
          },
          progress: () => {}
        });
      } catch (e) {
        this.logger.error(e.message);
      }
      // TODO add all job properties https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#job
      return { id: 0, data, finished: async () => {} };
    }
  }
};

export default FakeQueueMixin;
