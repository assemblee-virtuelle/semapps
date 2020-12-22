import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';
import * as resources from '../resources';

const getMessages = lang => ({
  ...frenchMessages,
  resources: Object.fromEntries(Object.entries(resources).map(([k, v]) => [k, v.translations[lang]]))
});

const i18nProvider = polyglotI18nProvider(getMessages, 'fr');

export default i18nProvider;
