module.exports = {
  ImporterMixin: require('./mixins/importer'),
  DiscourseImporterMixin: require('./mixins/discourse'),
  DrupalImporterMixin: require('./mixins/drupal'),
  GoGoCartoImporterMixin: require('./mixins/gogocarto'),
  HumHubImporterMixin: require('./mixins/humhub'),
  JotformImporterMixin: require('./mixins/jotform'),
  MobilizonImporterMixin: require('./mixins/mobilizon'),
  PrestaShopImporterMixin: require('./mixins/prestashop'),
  YesWikiImporterMixin: require('./mixins/yeswiki'),
  WordpressImporterMixin: require('./mixins/wordpress'),
  ...require('./utils')
};
