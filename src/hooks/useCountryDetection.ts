'use client'

import { useState, useEffect } from 'react'

export function useCountryDetection() {
  const [country, setCountry] = useState<string | null>(null)
  const [isBrazil, setIsBrazil] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const detectCountry = async () => {
      try {
        // Tentar múltiplas APIs para maior confiabilidade
        const apis = [
          'https://ipapi.co/json/',
          'https://ip-api.com/json/',
          'https://api.country.is/'
        ]
        
        let countryCode = null
        
        for (const api of apis) {
          try {
            const response = await fetch(api, { 
              timeout: 3000,
              headers: {
                'Accept': 'application/json'
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              
              // Diferentes APIs retornam dados em formatos diferentes
              if (data.country_code) {
                countryCode = data.country_code
                break
              } else if (data.countryCode) {
                countryCode = data.countryCode
                break
              } else if (data.country) {
                countryCode = data.country
                break
              }
            }
          } catch (apiError) {
            console.log(`API ${api} falhou:`, apiError)
            continue
          }
        }
        
        if (countryCode) {
          setCountry(countryCode)
          setIsBrazil(countryCode === 'BR')
        } else {
          // Fallback: detectar por idioma do navegador
          const browserLang = navigator.language || navigator.languages?.[0]
          const isBrazilian = browserLang?.includes('pt-BR') || browserLang?.includes('pt')
          
          if (isBrazilian) {
            setCountry('BR')
            setIsBrazil(true)
          } else {
            setCountry('US') // Fallback para internacional
            setIsBrazil(false)
          }
        }
      } catch (error) {
        console.log('Erro ao detectar país, usando Brasil como padrão:', error)
        // Fallback para Brasil em caso de erro
        setCountry('BR')
        setIsBrazil(true)
      } finally {
        setLoading(false)
      }
    }

    detectCountry()
  }, [])

  return { country, isBrazil, loading, error: null }
}
