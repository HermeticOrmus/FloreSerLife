import { body, param, query, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

// Middleware to check validation results
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg
      }))
    });
  }
  next();
};

// Common validation rules
export const emailValidation = () =>
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters');

export const passwordValidation = () =>
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .isLength({ max: 128 })
    .withMessage('Password must not exceed 128 characters')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number');

export const nameValidation = (fieldName: string) =>
  body(fieldName)
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(`${fieldName} must be between 1 and 100 characters`)
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(`${fieldName} must contain only letters, spaces, hyphens, and apostrophes`);

export const uuidValidation = (paramName: string) =>
  param(paramName)
    .isUUID()
    .withMessage(`${paramName} must be a valid UUID`);

// Sanitize text input to prevent XSS
export const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';

  // Remove any HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '');

  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return sanitized.trim();
};

// Sanitize object fields recursively
export const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

// Email content validation (for survey responses, messages, etc.)
export const textContentValidation = (fieldName: string, maxLength: number = 5000) =>
  body(fieldName)
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${fieldName} must not exceed ${maxLength} characters`)
    .customSanitizer((value) => sanitizeText(value));

// URL validation
export const urlValidation = (fieldName: string) =>
  body(fieldName)
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage(`${fieldName} must be a valid URL`)
    .isLength({ max: 2048 })
    .withMessage(`${fieldName} must not exceed 2048 characters`);

// Archetype validation
export const archetypeValidation = () =>
  body('archetype')
    .isIn(['bee', 'hummingbird', 'butterfly', 'beetle'])
    .withMessage('Invalid archetype. Must be one of: bee, hummingbird, butterfly, beetle');

// Experience level validation
export const experienceLevelValidation = () =>
  body('experienceLevel')
    .isIn(['rising', 'evolving', 'wise'])
    .withMessage('Invalid experience level. Must be one of: rising, evolving, wise');

// Numeric validation
export const numericValidation = (fieldName: string, min: number = 0, max: number = Number.MAX_SAFE_INTEGER) =>
  body(fieldName)
    .isInt({ min, max })
    .withMessage(`${fieldName} must be an integer between ${min} and ${max}`);
