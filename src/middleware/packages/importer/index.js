module.exports = {
  ImporterMixin: require('./mixins/importer'),
  DiscourseImporterMixin: require('./mixins/discourse'),
  DrupalImporterMixin: require('./mixins/drupal'),
  GoGoCartoImporterMixin: require('./mixins/gogocarto'),
  MobilizonImporterMixin: require('./mixins/mobilizon'),
  PrestaShopImporterMixin: require('./mixins/prestashop'),
  YesWikiImporterMixin: require('./mixins/yeswiki'),
  ...require('./utils')
};
