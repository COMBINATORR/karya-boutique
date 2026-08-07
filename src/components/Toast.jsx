import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const ToastContext = createContext({
  showToast: () => {},
})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message) => {
    setToast(message)
    window.setTimeout(() => {
      setToast(null)
    }, 2400)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 pointer-events-none"
          >
            <div className="liquid-glass-light flex items-center gap-2.5 rounded-[var(--radius-sm)] px-4 py-3 shadow-elevated border border-[var(--border-color)]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#25D366]" strokeWidth={2} />
              <span className="font-display text-xs font-semibold tracking-tight text-[var(--text-primary)]">
                {toast}
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
