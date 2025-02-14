import { aj } from "../config/rate-limit.js"

export const arcjetMiddleware = async (req, res, next) => {
    try {

        const decision = await aj.protect(req, {requested: 2})
        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({success: false, message: "Rate limit exceeded"})
            }
            if(decision.reason.isBot()) {
                return res.status(403).json({success: false, message: "No bots allowed"})
            }
            if(decision.reason.isSensitiveInfo()) {
                return res.status(403).json({success: false, message: "Sensitive information detected"})
            }
            return res.status(403).json({success: false, message: "Access denied"})
        }
        
        next()
    } catch (error) {
        next(error)
    }
}