import logger from '../config/logger.js'
import { buildPaginationResponse, getPagination } from '../helpers/pagination.js'
import Notification from '../models/notification.model.js'
import { ROLES } from '../utils/index.js'

export const getNotifications = async (req, res, next) => {
    try {

        const { decoded, query } = req
        const { skip, limit, page, page_size } = getPagination(query)

        const filter = {}

        if (decoded?.role !== ROLES.ADMIN) filter.user = decoded?.id

        const total = await Notification.countDocuments(filter)

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean({ virtuals: true })

        logger.info(`Notification fetched by ${decoded?.role}: ${decoded?.id}`)

        return res.status(200).json({
            success: true,
            message: 'Notification fetched successfully.',
            ...buildPaginationResponse(notifications, total, page, page_size),
        })

    } catch (error) {
        logger.error(`Get Notification Error: ${error.message}`)
        next(error)
    }

}