export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  message?: string
}

export interface ValidationRules {
  [key: string]: ValidationRule[]
}

export interface ValidationError {
  field: string
  message: string
}

export const validateField = (
  value: string,
  rules: ValidationRule[]
): string | null => {
  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      return rule.message || 'This field is required'
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} characters required`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Invalid format'
    }
  }

  return null
}

export const validateForm = (
  formData: Record<string, string>,
  rules: ValidationRules
): ValidationError[] => {
  const errors: ValidationError[] = []

  Object.keys(rules).forEach((field) => {
    const value = formData[field] || ''
    const fieldRules = rules[field]
    const error = validateField(value, fieldRules)

    if (error) {
      errors.push({ field, message: error })
    }
  })

  return errors
}

// Common validation patterns
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phonePattern = /^[\d\s\-\+\(\)]+$/
export const urlPattern = /^https?:\/\/.+/

// Contact form validation rules
export const contactFormRules: ValidationRules = {
  fullName: [
    {
      required: true,
      message: 'Please enter your full name',
    },
    {
      minLength: 2,
      message: 'Name must be at least 2 characters',
    },
    {
      maxLength: 100,
      message: 'Name must be less than 100 characters',
    },
  ],
  email: [
    {
      required: true,
      message: 'Please enter your email address',
    },
    {
      pattern: emailPattern,
      message: 'Please enter a valid email address',
    },
  ],
  phone: [
    {
      pattern: phonePattern,
      message: 'Please enter a valid phone number',
    },
  ],
  service: [
    {
      required: true,
      message: 'Please tell us which service you need',
    },
    {
      minLength: 3,
      message: 'Service must be at least 3 characters',
    },
    {
      maxLength: 100,
      message: 'Service must be less than 100 characters',
    },
  ],
  message: [
    {
      required: true,
      message: 'Please enter your message',
    },
    {
      minLength: 10,
      message: 'Message must be at least 10 characters',
    },
    {
      maxLength: 1000,
      message: 'Message must be less than 1000 characters',
    },
  ],
}
