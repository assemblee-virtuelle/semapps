import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';
import { frenchMessages as authFrenchMessages } from '@semapps/auth-provider';
import * as resources from '../resources';

const getMessages = lang => ({
  ...frenchMessages,
  ...authFrenchMessages,
  resources: Object.fromEntries(
    Object.entries(resources).map(([k, v]) => [k, v.translations ? v.translations[lang] : {}])
  )
});

const i18nProvider = polyglotI18nProvider(getMessages, 'fr', {
  allowMissing: true
});

export default i18nProvider;
