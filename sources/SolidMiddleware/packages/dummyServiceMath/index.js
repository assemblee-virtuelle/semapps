"use strict";
module.exports = {
	name: "math",
	actions: {
		add(ctx) {
			// count++;
			return Number(ctx.params.a) + Number(ctx.params.b);
		}
	}
};
