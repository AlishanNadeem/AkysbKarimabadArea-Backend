import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import logger from '../config/logger.js'
import Role from '../models/role.model.js'

dotenv.config()

export const AuthVerifier = async (req, res, next) => {
    try {

        const auth_header = req.headers.authorization

        if (!auth_header || !auth_header.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token missing or malformed',
            })
        }

        const token = auth_header.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.decoded = decoded

        next()

    } catch (error) {

        logger.error('Auth middleware error:', error)

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.',
            })
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid or unauthorized token',
        })

    }
}

export const OptionalAuthVerifier = (req, res, next) => {
    try {

        const auth_header = req.headers.authorization

        if (!auth_header || !auth_header.startsWith('Bearer ')) {
            req.decoded = null
            return next()
        }

        const token = auth_header.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.decoded = decoded

        next()

    } catch (error) {

        logger.error('Auth middleware error:', error)

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please log in again.',
            })
        }

        return res.status(401).json({
            success: false,
            message: 'Invalid or unauthorized token',
        })

    }
}

export const RequirePermission = (permission_keys) => async (req, res, next) => {
    try {

        const { role } = req.decoded

        if (!role) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized.',
            })
        }

        const user_permissions = await Role.getPermissionKeys(role.slug)

        const has_permission = permission_keys.every((key) => user_permissions.includes(key))

        if (!has_permission) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
            })
        }

        req.permissions = user_permissions

        next()

    } catch (error) {

        logger.error('Permission middleware error:', error)

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        })

    }
}