const extractContext = (context: any, key: any) => {
  const property = context.find((property: any) => property.id.startsWith(`${key}.`));
  if (property) return property.text;
};

export default extractContext;
