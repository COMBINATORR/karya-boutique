/**
 * Scroll chapters — narrative beats for progress dots & chapter titles.
 * `selector` must match a section id in the page.
 */
export const CHAPTERS = [
  { id: 'top', selector: '#top', labelKey: 'chapter.top', shortKey: 'chapter.topShort' },
  {
    id: 'categories',
    selector: '#categories',
    labelKey: 'chapter.categories',
    shortKey: 'chapter.categoriesShort',
  },
  {
    id: 'details',
    selector: '#details',
    labelKey: 'chapter.details',
    shortKey: 'chapter.detailsShort',
  },
  {
    id: 'features',
    selector: '#features',
    labelKey: 'chapter.features',
    shortKey: 'chapter.featuresShort',
  },
  {
    id: 'about',
    selector: '#about',
    labelKey: 'chapter.about',
    shortKey: 'chapter.aboutShort',
  },
  { id: 'faq', selector: '#faq', labelKey: 'chapter.faq', shortKey: 'chapter.faqShort' },
  {
    id: 'location',
    selector: '#location',
    labelKey: 'chapter.location',
    shortKey: 'chapter.locationShort',
  },
]
