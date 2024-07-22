/**
 * Translations Consistency Checks Config
 * ==================================
 *
 */

module.exports = {
  templates: {
    include: [
      "../../web/themes/new_weather_theme/templates/**/*.twig"
    ],
    exclude: [
      'views-mini-pager.html.twig',
      'pager.html.twig',
      'menu-local-tasks.html.twig',
      'breadcrumb.html.twig',
      'maintenance-page.html.twig',
      'field--comment.html.twig',
      'filter-tips.html.twig',
      'mark.html.twig',
      'block--local-tasks-block.html.twig'
    ]
  },

  php: {
    include: [
      "../../web/modules/weather_cms/**/*.php",
      "../../web/modules/weather_cms/**/*.module",
      "../../web/modules/weather_data/**/*.php",
      "../../web/modules/weather_data/**/*.module"
    ],
    exclude: []
  },

  translations: {
    include: [
      "../../web/modules/weather_i18n/translations/*.po"
    ],
    exclude: []
  }
};
