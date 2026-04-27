'use client'

import { useState, useRef } from 'react'
import { X, Download, QrCode, ExternalLink } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  defaultUrl?: string
}

export default function QRCodeModal({ isOpen, onClose, defaultUrl = '' }: QRCodeModalProps) {
  const [url, setUrl] = useState(defaultUrl)
  const qrRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const isValidUrl = url.trim().length > 0

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = 400
      canvas.height = 400
      ctx?.drawImage(img, 0, 0, 400, 400)
      const link = document.createElement('a')
      link.download = 'review-qr-code.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full border border-slate-200 animate-scale-in">
        <div className="sticky top-0 bg-blue-800 text-white p-5 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
              <QrCode size={17} />
            </div>
            <div>
              <h2 className="text-base font-bold">QR Code Generator</h2>
              <p className="text-xs text-blue-200/70">Let customers scan to leave a review</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1.5">Review link URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://g.page/r/your-google-review-link"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
              <ExternalLink size={10} />
              Tip: In Google Business Profile, go to Reviews → Get more reviews → Copy link
            </p>
          </div>

          {isValidUrl ? (
            <div className="flex flex-col items-center gap-4">
              <div ref={qrRef} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <QRCodeSVG
                  value={url.trim()}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#1e293b"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Print and display this at your business — customers scan it to jump straight to your review page.
              </p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Download size={15} />
                Download PNG
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center">
                <QrCode size={28} className="text-slate-300" />
              </div>
              <p className="text-sm text-slate-400">Enter a URL above to generate your QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
