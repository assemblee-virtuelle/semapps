import createDecorator from 'final-form-calculate';

const copyValues = fields => {
  let calculations = [];
  for (let [fromField, toField] of Object.entries(fields)) {
    calculations.push({
      field: fromField,
      updates: {
        [toField]: pairValue => pairValue
      }
    });
  }
  return createDecorator(...calculations);
};

export default copyValues;
