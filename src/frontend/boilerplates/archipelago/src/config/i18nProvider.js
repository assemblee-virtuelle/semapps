import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';

import documents from '../resources/documents';
import events from '../resources/events';
import themes from '../resources/themes';
import projects from '../resources/projects';
import organizations from '../resources/organizations';
import skills from '../resources/skills';
import users from '../resources/users';

const getMessages = lang => ({
  ...frenchMessages,
  resources: {
    ...organizations.translations[lang]
  }
});

const i18nProvider = polyglotI18nProvider(getMessages, 'fr');

export default i18nProvider;
