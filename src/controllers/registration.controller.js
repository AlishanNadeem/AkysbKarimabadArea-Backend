import logger from '../config/logger.js'
import Event from '../models/event.model.js'
import Participant from '../models/participant.model.js'
import Registration, { PAYMENT_METHOD, PAYMENT_STATUS } from '../models/registration.model.js'
import { EVENT_STATUS } from '../utils/index.js'

export const addRegistration = async (req, res, next) => {
    try {

        const { body, decoded } = req
        const {
            event: event_id,
            participant: participant_id,
            payment,
        } = body

        const event = await Event.findById(event_id)

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found.',
            })
        }

        if (event.status !== EVENT_STATUS.PUBLISHED) {
            return res.status(400).json({
                success: false,
                message: 'Registration is only allowed for published events.',
            })
        }

        if (event.is_full) {
            return res.status(400).json({
                success: false,
                message: 'Event is full. No more registrations allowed.',
            })
        }

        if (event.registration_deadline && new Date() > event.registration_deadline) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline has passed.',
            })
        }

        const participant = await Participant.findById(participant_id)

        if (!participant || !participant.active) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found.',
            })
        }

        const existing = await Registration.findOne({
            event: event_id,
            participant: participant_id,
        })

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'Participant is already registered for this event.',
            })
        }

        const payment_status = event.is_free ? PAYMENT_STATUS.PAID : (payment?.status || PAYMENT_STATUS.PENDING)
        const payment_method = event.is_free ? null : (payment?.method || PAYMENT_METHOD.CASH)
        const is_paid = payment_status === PAYMENT_STATUS.PAID

        const registration = new Registration({
            event: event_id,
            participant: participant_id,
            amount_paid: event.fees,
            created_by: decoded.id,
            payment: {
                status: payment_status,
                method: payment_method,
                notes: payment?.notes || null,
                paid_at: is_paid ? new Date() : null,
                paid_by: is_paid ? decoded.id : null,
            },
        })

        await registration.save()

        if (event.max_registrations.enabled) {
            event.current_registrations += 1
            await event.save()
        }

        logger.info(`Registration created for participant: ${participant_id} in event: ${event_id} by user: ${decoded.id}`)

        return res.status(201).json({
            success: true,
            message: 'Registration created successfully.',
            data: registration,
        })

    } catch (error) {
        logger.error(`Add Registration Error: ${error.message}`)
        next(error)
    }
}