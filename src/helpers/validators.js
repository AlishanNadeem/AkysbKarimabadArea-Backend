import Joi from 'joi'
import { AUTH_TYPES, ENUM_EVENT_TYPES, ENUM_PAYMENT_METHOD, ENUM_PAYMENT_STATUS, ENUM_ROLES } from '../utils/index.js'

export const SIGNUP_VALIDATOR = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.empty': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'string.empty': 'Email is required',
    }),
    password: Joi.when('auth_provider', {
        is: AUTH_TYPES.EMAIL,
        then: Joi.string().min(6).required().messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long',
        }),
        otherwise: Joi.string().optional(),
    }),
    auth_provider: Joi.string().valid(...Object.values(AUTH_TYPES)).default(AUTH_TYPES.EMAIL),
    provider_id: Joi.when('auth_provider', {
        is: Joi.not(AUTH_TYPES.EMAIL),
        then: Joi.string().required().messages({
            'string.empty': 'Provider id is required for social signup',
        }),
        otherwise: Joi.optional(),
    }),
})

export const LOGIN_VALIDATOR = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
    device_id: Joi.string().optional().messages({
        'string.base': 'Device ID must be a string',
    }),
})

export const SOCIAL_LOGIN_VALIDATOR = Joi.object({
    access_token: Joi.string().required().messages({
        'string.empty': 'Access token is required',
        'any.required': 'Access token is required',
    }),
    type: Joi.string()
        .valid(...Object.values(AUTH_TYPES))
        .required()
        .messages({
            'any.only': `Type must be one of: ${Object.values(AUTH_TYPES).join(', ')}`,
            'string.empty': 'Type is required',
            'any.required': 'Type is required',
        }),
    device_id: Joi.string().optional().messages({
        'string.base': 'Device ID must be a string',
    }),
})

export const FORGET_PASSWORD_VALIDATOR = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'string.empty': 'Email is required',
    })
})

export const VERIFY_OTP_VALIDATOR = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'string.empty': 'Email is required',
    }),
    otp: Joi.string().length(6).required(),
})

export const SET_PASSWORD_VALIDATOR = Joi.object({
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    })
})

export const LOGOUT_VALIDATOR = Joi.object({
    device_id: Joi.string().optional().messages({
        'string.base': 'Device ID must be a string'
    })
})

export const COMPLETE_PROFILE_VALIDATOR = Joi.object({
    date_of_birth: Joi.date().allow(null).optional().messages({
        'date.base': 'Please enter a valid date of birth',
    }),
    country_code: Joi.string().required().messages({
        'string.base': 'Please enter a valid country code',
        'string.empty': 'Country code is required',
        'any.required': 'Country code is required',
    }),
    dialing_code: Joi.string().required().messages({
        'string.base': 'Please enter a valid dialing code',
        'string.empty': 'Dialing code is required',
        'any.required': 'Dialing code is required',
    }),
    phone: Joi.string().required().messages({
        'string.base': 'Please enter a valid phone number',
        'string.empty': 'Phone number is required',
        'any.required': 'Phone number is required',
    }),
    emergency_notes: Joi.string().optional().allow("").messages({
        'string.base': 'Please enter valid emergency notes',
    }),
})

export const CHANGE_PASSWORD_VALIDATOR = Joi.object({
    old_password: Joi.string().min(6).required().messages({
        "any.required": "Old password is required."
    }),
    new_password: Joi.string().min(6).required().messages({
        'string.empty': 'New password is required',
        'string.min': 'Password must be at least 6 characters long',
    })
})

export const UPDATE_PROFILE_VALIDATOR = Joi.object({
    name: Joi.string().min(2).max(50).optional().messages({
        'string.empty': 'Name cannot be empty.',
        'string.min': 'Name must be at least 2 characters long.',
        'string.max': 'Name cannot exceed 50 characters.'
    }),
    country_code: Joi.string().optional().messages({
        'string.empty': 'Country code cannot be empty.'
    }),
    dialing_code: Joi.string().optional().messages({
        'string.empty': 'Dialing code cannot be empty.'
    }),
    phone: Joi.string().optional().messages({
        'string.empty': 'Phone number cannot be empty.'
    }),
    emergency_notes: Joi.string().optional().allow("").messages({
        'string.base': 'Please enter valid emergency notes',
    }),
    date_of_birth: Joi.date().allow(null).optional().messages({
        'date.base': 'Please enter a valid date of birth',
    }),
})

export const CREATE_FEEDBACK_VALIDATOR = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'any.required': 'Name is required.',
        'string.empty': 'Name cannot be empty.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email',
        'any.required': 'Email is required.'
    }),
    subject: Joi.string().min(3).max(150).required().messages({
        'any.required': 'Subject is required.',
        'string.empty': 'Subject cannot be empty.'
    }),
    message: Joi.string().min(5).max(1000).required().messages({
        'any.required': 'Message is required.',
        'string.empty': 'Message cannot be empty.'
    })
})

export const CREATE_EVENT_VALIDATOR = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
        'any.required': 'Event name is required.',
        'string.empty': 'Event name cannot be empty.',
        'string.min': 'Event name must be at least 2 characters long.',
        'string.max': 'Event name cannot exceed 100 characters.',
    }),
    description: Joi.string().min(10).optional().messages({
        'string.empty': 'Description cannot be empty.',
        'string.min': 'Description must be at least 10 characters long.',
    }),
    type: Joi.string().valid(...ENUM_EVENT_TYPES).required().messages({
        'any.required': 'Event type is required.',
        'string.empty': 'Event type cannot be empty.',
        'any.only': `Type must be one of: ${ENUM_EVENT_TYPES.join(', ')}`,
    }),
    date: Joi.object({
        from: Joi.date().greater('now').required().messages({
            'any.required': 'Start date is required.',
            'date.base': 'Start date must be a valid date.',
            'date.greater': 'Start date must be in the future.',
        }),
        to: Joi.date().min(Joi.ref('from')).required().messages({
            'any.required': 'End date is required.',
            'date.base': 'End date must be a valid date.',
            'date.min': 'End date must be same as or after start date.',
        }),
    }).required().messages({
        'any.required': 'Date is required.',
    }),
    time: Joi.object({
        from: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
            'any.required': 'Start time is required.',
            'string.empty': 'Start time cannot be empty.',
            'string.pattern.base': 'Start time must be in HH:MM format.',
        }),
        to: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
            'any.required': 'End time is required.',
            'string.empty': 'End time cannot be empty.',
            'string.pattern.base': 'End time must be in HH:MM format.',
        }),
    }).required().messages({
        'any.required': 'Time is required.',
    }),
    age: Joi.object({
        from: Joi.number().min(0).optional().messages({
            'number.base': 'Age from must be a number.',
            'number.min': 'Age from must be at least 0.',
        }),
        to: Joi.number().min(Joi.ref('from')).optional().messages({
            'number.base': 'Age to must be a number.',
            'number.min': 'Age to must be greater than age from.',
        }),
    }).optional(),
    venue: Joi.string().min(2).required().messages({
        'any.required': 'Venue is required.',
        'string.empty': 'Venue cannot be empty.',
        'string.min': 'Venue must be at least 2 characters long.',
    }),
    fees: Joi.number().min(0).optional().messages({
        'number.base': 'Fees must be a number.',
        'number.min': 'Fees cannot be negative.',
    }),
    max_registrations: Joi.object({
        enabled: Joi.boolean().required().messages({
            'any.required': 'Max registrations enabled flag is required.',
        }),
        limit: Joi.when('enabled', {
            is: true,
            then: Joi.number().min(1).required().messages({
                'any.required': 'Registration limit is required when max registrations is enabled.',
                'number.min': 'Registration limit must be at least 1.',
            }),
            otherwise: Joi.number().optional().allow(null),
        }),
    }).optional(),
    registration_deadline: Joi.date().greater('now').optional().allow(null).messages({
        'date.base': 'Registration deadline must be a valid date.',
        'date.greater': 'Registration deadline must be in the future.',
    }),
})

export const CREATE_REGISTRATION_VALIDATOR = Joi.object({
    event: Joi.string().required().messages({
        'any.required': 'Event is required.',
        'string.empty': 'Event cannot be empty.',
    }),
    participant: Joi.string().required().messages({
        'any.required': 'Participant is required.',
        'string.empty': 'Participant cannot be empty.',
    }),
    payment: Joi.object({
        status: Joi.string()
            .valid(...ENUM_PAYMENT_STATUS)
            .optional()
            .messages({
                'any.only': `Payment status must be one of: ${ENUM_PAYMENT_STATUS.join(', ')}`,
            }),
        method: Joi.string()
            .valid(...ENUM_PAYMENT_METHOD)
            .optional()
            .messages({
                'any.only': `Payment method must be one of: ${ENUM_PAYMENT_METHOD.join(', ')}`,
            }),
        notes: Joi.string().max(200).optional().allow(null, '').messages({
            'string.max': 'Notes cannot exceed 200 characters.',
        }),
    }).optional(),
})