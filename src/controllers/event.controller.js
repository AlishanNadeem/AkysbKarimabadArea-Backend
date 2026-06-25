import Event from "../models/event.model.js"
import logger from "../config/logger.js"
import { buildPaginationResponse, getPagination } from "../helpers/pagination.js"
import {
    ENUM_EVENT_STATUS,
    ENUM_EVENT_TYPES,
    searchRegex,
} from "../utils/index.js"

export const getEvents = async (req, res, next) => {
    try {

        const { query, decoded } = req
        const { skip, limit, page, page_size } = getPagination(query)

        const filter = {}

        if (query.type && ENUM_EVENT_TYPES.includes(query.type)) {
            filter.type = query.type
        }

        if (query.status && ENUM_EVENT_STATUS.includes(query.status)) {
            filter.status = query.status
        }

        if (query.search) {
            filter.name = searchRegex(query.search)
        }

        const total = await Event.countDocuments(filter)

        let events = await Event.find(filter)
            .sort({ 'date.from': 1 })
            .skip(skip)
            .limit(limit)
            .populate('created_by', 'name email image')
            .lean({ virtuals: true })

        logger.info(`Events fetched by user: ${decoded?.id}`)

        return res.status(200).json({
            success: true,
            message: 'Events fetched successfully.',
            ...buildPaginationResponse(events, total, page, page_size),
        })

    } catch (error) {
        logger.error(`Get Events Error: ${error.message}`)
        next(error)
    }
}

export const getEventById = async (req, res, next) => {
    try {

        const { params, decoded } = req

        const event = await Event.findById(params.id)
            .populate('created_by', 'name email image')
            .lean({ virtuals: true })

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found.',
            })
        }

        logger.info(`Event fetched: ${params.id} by user: ${decoded?.id}`)

        return res.status(200).json({
            success: true,
            message: 'Event fetched successfully.',
            data: event,
        })

    } catch (error) {
        logger.error(`Get Event Error: ${error.message}`)
        next(error)
    }
}

export const addEvent = async (req, res, next) => {
    try {

        const { body, decoded, file } = req
        const {
            name,
            description,
            type,
            date,
            time,
            age,
            venue,
            fees,
            max_registrations,
            registration_deadline,
        } = body

        console.log(file)

        const event = new Event({
            name,
            description,
            image: file?.path || null,
            type,
            date,
            time,
            age,
            venue,
            fees,
            max_registrations,
            registration_deadline,
            created_by: decoded.id,
        })

        await event.save()

        logger.info(`Event created: ${name} by user: ${decoded.id}`)

        return res.status(201).json({
            success: true,
            message: 'Event created successfully.',
            data: event
        })

    } catch (error) {
        logger.error(`Add Event Error: ${error.message}`)
        next(error)
    }
}
