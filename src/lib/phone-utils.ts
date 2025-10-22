// Biblioteca unificada para tratamento de telefones
// Formato padrão: +55 (11) 99999-9999

export interface PhoneFormat {
  countryCode: string
  areaCode: string
  number: string
  formatted: string
  international: string
  isValid: boolean
}

export interface CountryConfig {
  code: string
  name: string
  flag: string
  minLength: number
  maxLength: number
  format: (phone: string) => string
}

// Configurações por país
export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  '55': {
    code: '55',
    name: 'Brasil',
    flag: '🇧🇷',
    minLength: 10,
    maxLength: 11,
    format: (phone: string) => {
      const clean = phone.replace(/\D/g, '')
      if (clean.length === 10) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`
      } else if (clean.length === 11) {
        return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
      }
      return phone
    }
  },
  '1': {
    code: '1',
    name: 'EUA/Canadá',
    flag: '🇺🇸',
    minLength: 10,
    maxLength: 10,
    format: (phone: string) => {
      const clean = phone.replace(/\D/g, '')
      if (clean.length === 10) {
        return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`
      }
      return phone
    }
  },
  '351': {
    code: '351',
    name: 'Portugal',
    flag: '🇵🇹',
    minLength: 9,
    maxLength: 9,
    format: (phone: string) => {
      const clean = phone.replace(/\D/g, '')
      if (clean.length === 9) {
        return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`
      }
      return phone
    }
  },
  '34': {
    code: '34',
    name: 'Espanha',
    flag: '🇪🇸',
    minLength: 9,
    maxLength: 9,
    format: (phone: string) => {
      const clean = phone.replace(/\D/g, '')
      if (clean.length === 9) {
        return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`
      }
      return phone
    }
  }
}

// Lista de países para seleção
export const COUNTRIES = [
  { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  { code: '+1', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+1', name: 'Canadá', flag: '🇨🇦' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', name: 'Colômbia', flag: '🇨🇴' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+598', name: 'Uruguai', flag: '🇺🇾' },
  { code: '+591', name: 'Bolívia', flag: '🇧🇴' },
  { code: '+595', name: 'Paraguai', flag: '🇵🇾' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+34', name: 'Espanha', flag: '🇪🇸' },
]

/**
 * Normaliza um telefone para o formato padrão
 * @param phone - Telefone em qualquer formato
 * @param countryCode - Código do país (padrão: 55 para Brasil)
 * @returns Objeto PhoneFormat normalizado
 */
export function normalizePhone(phone: string, countryCode: string = '55'): PhoneFormat {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Remove código do país se presente
  let phoneWithoutCountry = cleanPhone
  let detectedCountryCode = countryCode
  
  // Detectar código do país automaticamente
  for (const [code, config] of Object.entries(COUNTRY_CONFIGS)) {
    if (cleanPhone.startsWith(code) && cleanPhone.length >= config.minLength + code.length) {
      detectedCountryCode = code
      phoneWithoutCountry = cleanPhone.substring(code.length)
      break
    }
  }
  
  // Se não detectou código do país, usar o fornecido
  if (detectedCountryCode === countryCode && !cleanPhone.startsWith(countryCode)) {
    phoneWithoutCountry = cleanPhone
  }
  
  // Extrair código de área e número
  let areaCode = ''
  let number = phoneWithoutCountry
  
  if (detectedCountryCode === '55') {
    // Brasil: DDD + número
    if (phoneWithoutCountry.length >= 10) {
      areaCode = phoneWithoutCountry.slice(0, 2)
      number = phoneWithoutCountry.slice(2)
    }
  } else if (detectedCountryCode === '1') {
    // EUA/Canadá: área + número
    if (phoneWithoutCountry.length >= 10) {
      areaCode = phoneWithoutCountry.slice(0, 3)
      number = phoneWithoutCountry.slice(3)
    }
  } else {
    // Outros países: usar como está
    number = phoneWithoutCountry
  }
  
  // Validar comprimento
  const config = COUNTRY_CONFIGS[detectedCountryCode]
  const isValid = config ? 
    number.length >= config.minLength && number.length <= config.maxLength :
    number.length >= 8 && number.length <= 15
  
  // Formatar telefone
  const formatted = config ? config.format(number) : number
  const international = `+${detectedCountryCode}${phoneWithoutCountry}`
  
  return {
    countryCode: detectedCountryCode,
    areaCode,
    number,
    formatted,
    international,
    isValid
  }
}

/**
 * Valida se um telefone é válido
 * @param phone - Telefone para validar
 * @param countryCode - Código do país
 * @returns true se válido
 */
export function isValidPhone(phone: string, countryCode: string = '55'): boolean {
  return normalizePhone(phone, countryCode).isValid
}

/**
 * Formata um telefone para exibição
 * @param phone - Telefone para formatar
 * @param countryCode - Código do país
 * @returns Telefone formatado
 */
export function formatPhone(phone: string, countryCode: string = '55'): string {
  return normalizePhone(phone, countryCode).formatted
}

/**
 * Converte telefone para formato internacional
 * @param phone - Telefone para converter
 * @param countryCode - Código do país
 * @returns Telefone no formato internacional
 */
export function toInternationalFormat(phone: string, countryCode: string = '55'): string {
  return normalizePhone(phone, countryCode).international
}

/**
 * Aplica máscara de telefone durante digitação
 * @param value - Valor atual do input
 * @param countryCode - Código do país
 * @returns Valor com máscara aplicada
 */
export function applyPhoneMask(value: string, countryCode: string = '55'): string {
  const clean = value.replace(/\D/g, '')
  const config = COUNTRY_CONFIGS[countryCode]
  
  if (!config) {
    return clean.slice(0, 15) // Limite genérico
  }
  
  if (countryCode === '55') {
    // Brasil: (DDD) 99999-9999
    if (clean.length <= 2) {
      return clean
    } else if (clean.length <= 6) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2)}`
    } else if (clean.length <= 10) {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`
    } else {
      return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`
    }
  } else if (countryCode === '1') {
    // EUA/Canadá: (999) 999-9999
    if (clean.length <= 3) {
      return clean
    } else if (clean.length <= 6) {
      return `(${clean.slice(0, 3)}) ${clean.slice(3)}`
    } else {
      return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`
    }
  } else if (countryCode === '351') {
    // Portugal: 999 999 999
    if (clean.length <= 3) {
      return clean
    } else if (clean.length <= 6) {
      return `${clean.slice(0, 3)} ${clean.slice(3)}`
    } else {
      return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)}`
    }
  }
  
  return clean.slice(0, config.maxLength)
}

/**
 * Extrai código do país de um telefone
 * @param phone - Telefone com possível código do país
 * @returns Código do país detectado
 */
export function extractCountryCode(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  
  for (const [code] of Object.entries(COUNTRY_CONFIGS)) {
    if (clean.startsWith(code)) {
      return code
    }
  }
  
  return '55' // Padrão Brasil
}

/**
 * Converte telefone para formato de armazenamento no banco
 * @param phone - Telefone para converter
 * @param countryCode - Código do país
 * @returns Telefone no formato para armazenamento
 */
export function toStorageFormat(phone: string, countryCode: string = '55'): string {
  const normalized = normalizePhone(phone, countryCode)
  return normalized.international.replace('+', '')
}

/**
 * Converte telefone do banco para formato de exibição
 * @param storedPhone - Telefone armazenado no banco
 * @returns Telefone formatado para exibição
 */
export function fromStorageFormat(storedPhone: string): PhoneFormat {
  return normalizePhone(storedPhone)
}
