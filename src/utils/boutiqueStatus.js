/**
 * Helper to calculate current status of KARYA boutique in Atyrau (UTC+5 / GMT+5).
 * Working hours: 10:00 - 20:00 daily.
 */
export function getBoutiqueStatus() {
  const now = new Date()

  // Get current UTC time in milliseconds and add 5 hours (Atyrau timezone)
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000
  const atyrauTime = new Date(utcMs + 5 * 3600000)

  const hours = atyrauTime.getHours()
  const minutes = atyrauTime.getMinutes()
  const currentMinutes = hours * 60 + minutes

  const openMinutes = 10 * 60 // 10:00
  const closeMinutes = 20 * 60 // 20:00

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes

  return {
    isOpen,
    hours,
    minutes,
    closeTime: '20:00',
    openTime: '10:00',
  }
}
