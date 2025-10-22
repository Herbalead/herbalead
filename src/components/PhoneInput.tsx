import React, { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { 
  COUNTRIES, 
  applyPhoneMask, 
  normalizePhone, 
  isValidPhone,
  toStorageFormat,
  extractCountryCode 
} from '@/lib/phone-utils'

interface PhoneInputProps {
  value: string
  onChange: (phone: string, formatted: string, isValid: boolean) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  showCountrySelector?: boolean
  defaultCountry?: string
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = "11999999999",
  required = false,
  disabled = false,
  className = "",
  showCountrySelector = true,
  defaultCountry = "55"
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState(defaultCountry)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValid, setIsValid] = useState(false)

  // Inicializar valores
  useEffect(() => {
    if (value) {
      const detectedCountry = extractCountryCode(value)
      setCountryCode(detectedCountry)
      
      const normalized = normalizePhone(value, detectedCountry)
      setPhoneNumber(normalized.number)
      setIsValid(normalized.isValid)
    }
  }, [value])

  // Atualizar quando país ou número mudam
  useEffect(() => {
    if (phoneNumber) {
      const normalized = normalizePhone(phoneNumber, countryCode)
      const storageFormat = toStorageFormat(phoneNumber, countryCode)
      
      setIsValid(normalized.isValid)
      onChange(storageFormat, normalized.formatted, normalized.isValid)
    } else {
      setIsValid(false)
      onChange("", "", false)
    }
  }, [phoneNumber, countryCode, onChange])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const maskedValue = applyPhoneMask(inputValue, countryCode)
    setPhoneNumber(maskedValue)
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value.replace('+', '')
    setCountryCode(newCountryCode)
    
    // Reformatar número com novo país
    if (phoneNumber) {
      const cleanNumber = phoneNumber.replace(/\D/g, '')
      const maskedValue = applyPhoneMask(cleanNumber, newCountryCode)
      setPhoneNumber(maskedValue)
    }
  }

  return (
    <div className={`flex ${className}`}>
      {showCountrySelector && (
        <select
          value={`+${countryCode}`}
          onChange={handleCountryChange}
          disabled={disabled}
          className="px-3 py-2 text-gray-900 bg-white border-2 border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium min-w-[120px]"
        >
          {COUNTRIES.map((country) => (
            <option key={`${country.code}-${country.name}`} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>
      )}
      
      <div className="relative flex-1">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full pl-10 pr-3 py-2 text-gray-900 bg-white border-2 border-gray-300 ${
            showCountrySelector ? 'rounded-r-md' : 'rounded-md'
          } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-medium ${
            !isValid && phoneNumber ? 'border-red-300 focus:ring-red-500' : ''
          }`}
        />
        
        {/* Indicador de validação */}
        {phoneNumber && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            ) : (
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Hook para usar o componente de telefone
export function usePhoneInput(initialValue: string = "", defaultCountry: string = "55") {
  const [phone, setPhone] = useState(initialValue)
  const [formattedPhone, setFormattedPhone] = useState("")
  const [isValid, setIsValid] = useState(false)

  const handlePhoneChange = (storageFormat: string, formatted: string, valid: boolean) => {
    setPhone(storageFormat)
    setFormattedPhone(formatted)
    setIsValid(valid)
  }

  return {
    phone,
    formattedPhone,
    isValid,
    handlePhoneChange
  }
}
