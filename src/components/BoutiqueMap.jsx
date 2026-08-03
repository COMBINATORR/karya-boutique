import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BOUTIQUE_COORDS, MAPS_DIR_URL, MAPS_URL } from '@/constants/contact'
import mapPinUrl from '@/assets/map-pin.jpg'

/**
 * Clean map + pulsing pin. Uses OSM tiles (reliable worldwide).
 */
export function BoutiqueMap({ title = 'KARYA' }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // React Strict Mode / HMR: clear previous Leaflet instance on this node
    if (el._leaflet_id) {
      try {
        const old = el._leaflet
        if (old && typeof old.remove === 'function') old.remove()
      } catch {
        /* ignore */
      }
      el._leaflet_id = undefined
      el.innerHTML = ''
    }

    let cancelled = false
    let map
    let ro
    let timers = []

    const init = () => {
      if (cancelled || !containerRef.current) return

      // Wait until container has real size (aspect-ratio layout)
      const { clientWidth: w, clientHeight: h } = containerRef.current
      if (w < 40 || h < 40) {
        timers.push(window.setTimeout(init, 80))
        return
      }

      try {
        const { lat, lng } = BOUTIQUE_COORDS
        const isCoarse =
          typeof window !== 'undefined' &&
          window.matchMedia('(pointer: coarse)').matches

        map = L.map(containerRef.current, {
          center: [lat, lng],
          zoom: isCoarse ? 15 : 16,
          minZoom: 12,
          maxZoom: 19,
          zoomControl: false,
          attributionControl: false, // no Leaflet / OSM badge on map
          scrollWheelZoom: false, // page scroll stays free; use pinch / +/- 
          dragging: true,
          // 'center' keeps pin under fingers while pinching on mobile
          touchZoom: isCoarse ? 'center' : true,
          doubleClickZoom: true,
          boxZoom: false,
          keyboard: true,
          bounceAtZoomLimits: true,
        })

        // Explicitly enable (body touch-action can leave handlers half-disabled)
        map.touchZoom.enable()
        map.dragging.enable()
        if (map.tap) map.tap.enable()

        L.control.zoom({ position: 'bottomright' }).addTo(map)

        const tiles = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '',
            subdomains: 'abc',
            minZoom: 12,
            maxZoom: 19,
            crossOrigin: true,
          },
        )

        tiles.on('tileerror', () => {
          // keep map chrome; user still sees pin + can open Google
        })

        tiles.on('load', () => {
          if (!cancelled) setStatus('ready')
        })

        tiles.addTo(map)

        /**
         * Geographic point = center of the RED DOT only.
         * iconAnchor must match that pixel in the icon, otherwise the pin
         * "swims" when zooming (pixel offset ≠ fixed meters).
         * Layout: [20×52 dot column | 72px card+label], red center at (10, 26).
         */
        const icon = L.divIcon({
          className: 'karya-map-marker',
          html: `
            <div class="karya-map-pin">
              <span class="karya-map-dot-wrap" aria-hidden="true">
                <span class="karya-map-pulse"></span>
                <span class="karya-map-pulse karya-map-pulse--delay"></span>
                <span class="karya-map-dot"></span>
              </span>
              <div class="karya-map-card-col">
                <span class="karya-map-card">
                  <img class="karya-map-photo" src="${mapPinUrl}" alt="" width="72" height="52" draggable="false" />
                </span>
                <span class="karya-map-label">${title}</span>
              </div>
            </div>
          `,
          iconSize: [100, 80],
          iconAnchor: [10, 26],
        })

        const marker = L.marker([lat, lng], {
          icon,
          keyboard: true,
          title,
          riseOnHover: true,
        }).addTo(map)

        marker.on('click', () => {
          window.open(MAPS_DIR_URL, '_blank', 'noopener,noreferrer')
        })

        mapRef.current = map

        const invalidate = () => {
          if (map) map.invalidateSize({ animate: false })
        }

        timers.push(window.setTimeout(invalidate, 50))
        timers.push(window.setTimeout(invalidate, 250))
        timers.push(window.setTimeout(invalidate, 600))
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setStatus((s) => (s === 'loading' ? 'ready' : s))
          }, 1200),
        )

        if (typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(() => invalidate())
          ro.observe(containerRef.current)
        }

        window.addEventListener('resize', invalidate)
        window.addEventListener('orientationchange', invalidate)

        // store cleanup extras on map
        map._karyaCleanup = () => {
          window.removeEventListener('resize', invalidate)
          window.removeEventListener('orientationchange', invalidate)
          if (ro) ro.disconnect()
        }
      } catch (err) {
        console.error('[BoutiqueMap]', err)
        if (!cancelled) setStatus('error')
      }
    }

    // Start after paint so aspect-ratio parent has height
    timers.push(window.requestAnimationFrame(() => init()))

    return () => {
      cancelled = true
      timers.forEach((id) => {
        window.clearTimeout(id)
        window.cancelAnimationFrame(id)
      })
      if (map) {
        if (typeof map._karyaCleanup === 'function') map._karyaCleanup()
        map.remove()
      }
      mapRef.current = null
      if (containerRef.current) {
        containerRef.current._leaflet_id = undefined
      }
    }
  }, [title])

  return (
    <div className="karya-map-shell relative h-full w-full min-h-[inherit]">
      {status === 'loading' && (
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center bg-white">
          <p className="text-xs font-medium uppercase tracking-widest text-[#8c867e]">
            Карта…
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center gap-3 bg-white p-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Карта временно недоступна
          </p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-[11px]"
          >
            Открыть в Google Maps
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        className="karya-map h-full w-full"
        style={{ minHeight: '260px', height: '100%', width: '100%' }}
        role="application"
        aria-label={title}
      />
    </div>
  )
}
