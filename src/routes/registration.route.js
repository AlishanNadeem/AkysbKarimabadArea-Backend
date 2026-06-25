import express from 'express'
import { addRegistration } from '../controllers/registration.controller.js'
import { CREATE_REGISTRATION_VALIDATOR } from '../helpers/validators.js'
import { AuthVerifier, RequirePermission } from '../middleware/auth.middleware.js'
import validator from '../middleware/validator.js'
import { PERMISSIONS } from '../utils/index.js'

const router = express.Router()

router.post('/create', AuthVerifier, RequirePermission([PERMISSIONS.REGISTRATION_CREATE]), validator(CREATE_REGISTRATION_VALIDATOR), addRegistration)

export default router