import cleanOrder from 'stylelint-config-clean-order';

const [orderGroups, orderOptions] = cleanOrder.rules['order/properties-order'];

const groupsWithoutEmptyLines = orderGroups.map((group) => ({
  ...group,
  emptyLineBefore: 'never',
}));

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: [
    'stylelint-order',
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-high-performance-animation',
  ],
  ignoreFiles: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/target/**'],
  rules: {
    'order/properties-order': [
      groupsWithoutEmptyLines,
      {
        ...orderOptions,
        emptyLineBeforeUnspecified: 'never',
        severity: 'warning',
      },
    ],

    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/no-low-performance-animation-properties': [
      true,
      {
        ignoreProperties: ['background-color', 'color', 'border-color', 'box-shadow', 'filter'],
        severity: 'warning',
      },
    ],

    'value-keyword-case': null,
    'custom-property-pattern': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'scss/dollar-variable-pattern': null,
    'scss/dollar-variable-empty-line-before': null,
    'scss/at-mixin-pattern': null,
    'scss/no-global-function-names': null,

    'hue-degree-notation': null,
    'lightness-notation': null,
    'alpha-value-notation': null,
    'color-function-notation': null,

    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],

    'property-no-vendor-prefix': [true, { ignoreProperties: ['font-smoothing'] }],
    'value-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'selector-no-vendor-prefix': [true, { ignoreSelectors: ['/-webkit-scrollbar/'] }],
  },
};
