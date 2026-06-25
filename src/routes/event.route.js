import express from 'express'
import { addEvent, getEventById, getEvents } from '../controllers/event.controller.js'
import { CREATE_EVENT_VALIDATOR } from '../helpers/validators.js'
import { AuthVerifier, RequirePermission } from '../middleware/auth.middleware.js'
import validator from '../middleware/validator.js'
import upload from '../middleware/upload.middleware.js'
import { PERMISSIONS } from '../utils/index.js'

const router = express.Router()

router.get('/get', AuthVerifier, RequirePermission([PERMISSIONS.EVENT_READ]), getEvents)

router.get('/get/:id', AuthVerifier, RequirePermission([PERMISSIONS.EVENT_READ]), getEventById)

router.post('/create', AuthVerifier, RequirePermission([PERMISSIONS.EVENT_CREATE]), upload('event').single('image'), validator(CREATE_EVENT_VALIDATOR), addEvent)

export default router