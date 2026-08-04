/** Real boutique contact details — single source of truth */

export const PHONE_E164 = '77023126998'
export const PHONE_DISPLAY = '+7 (702) 312-69-98'
export const PHONE_TEL = `tel:+${PHONE_E164}`
export const WHATSAPP_URL = `https://wa.me/${PHONE_E164}`

/** Instagram boutique */
export const INSTAGRAM_URL = 'https://www.instagram.com/symki_i_portmane_karya/'
export const INSTAGRAM_HANDLE = '@symki_i_portmane_karya'

export const PLACE_QUERY =
  'ТРЦ Насиха, Махамбета Утемисова 116д, Атырау'

/** Exact 2GIS firm page */
export const TWOGIS_FIRM_ID = '70000001103044715'
export const TWOGIS_URL =
  'https://2gis.kz/atyrau/search/karya/firm/70000001103044715/51.928817%2C47.101704'

/**
 * Exact Google Maps place: «KARYA since 1980»
 * Place pin from Google: 47.101619, 51.9297683
 */
export const MAPS_URL =
  'https://www.google.com/maps/place/KARYA+since+1980/@47.1015388,51.9296225,20.5z/data=!4m12!1m5!3m4!2zNDfCsDA2JzA2LjEiTiA1McKwNTUnNDMuNyJF!8m2!3d47.101704!4d51.928817!3m5!1s0x41a3ea180f00b0b5:0x477d9fe3ffc71d48!8m2!3d47.101619!4d51.9297683!16s%2Fg%2F11gdm6jtqs?entry=ttu'

/**
 * Fixed geographic position of the RED PULSE DOT on the map.
 * Change lat/lng here to move the pin (do NOT fudge Leaflet iconAnchor in px —
 * pixel offsets drift when zooming).
 * Google place «KARYA since 1980».
 */
export const BOUTIQUE_COORDS = {
  lat: 47.101819,
  lng: 51.9300683,
}

/** Route to the same Google pin */
export const MAPS_DIR_URL =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(`${BOUTIQUE_COORDS.lat},${BOUTIQUE_COORDS.lng}`)

/** Prefill WhatsApp when client wants a specific item shown */
export function whatsappRequestUrl(itemLabel = '') {
  const base =
    'Здравствуйте! Пишу с сайта KARYA. Хочу посмотреть в бутике'
  const text = itemLabel
    ? `${base}: ${itemLabel}. Подскажите, есть ли в наличии?`
    : `${base} изделие. Подскажите, когда удобно подойти?`
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`
}
