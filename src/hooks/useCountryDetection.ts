'use client'

import { useState, useEffect } from 'react'

export function useCountryDetection() {
  const [country, setCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Tentar detectar país via IP
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        
        if (data.country_code) {
          setCountry(data.country_code)
        } else {
          // Fallback para Brasil se não conseguir detectar
          setCountry('BR')
        }
      } catch (error) {
        console.log('Erro ao detectar país, usando Brasil como padrão:', error)
        // Fallback para Brasil em caso de erro
        setCountry('BR')
      } finally {
        setLoading(false)
      }
    }

    detectCountry()
  }, [])

  return { country, loading, isBrazil: country === 'BR' }
}
