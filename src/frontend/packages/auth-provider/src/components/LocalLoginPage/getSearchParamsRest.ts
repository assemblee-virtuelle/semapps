const USED_SEARCH_PARAMS = ['signup', 'reset_password', 'new_password', 'email', 'force-email'];

const getSearchParamsRest = (searchParams: any) => {
  const rest = [];
  for (const [key, value] of searchParams.entries()) {
    if (!USED_SEARCH_PARAMS.includes(key)) {
      rest.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  return rest.length > 0 ? rest.join('&') : '';
};

export default getSearchParamsRest;
