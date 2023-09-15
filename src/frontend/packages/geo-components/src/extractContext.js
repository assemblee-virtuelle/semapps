const extractContext = (context, key) => {
  const property = context.find(property => property.id.startsWith(`${key}.`));
  if (property) return property.text;
};

export default extractContext;
