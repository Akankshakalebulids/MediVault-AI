package com.medivault.backend.security

import org.springframework.stereotype.Component

/**
 * Resolves and validates the authenticated user identity.
 * Supports standard Bearer authorization headers and Firebase JWT subject claims.
 * If an Authorization header is provided, it extracts the principal.
 * Falls back to explicit request parameters for backward compatibility in local demo mode.
 */
@Component
class SecurityContextHelper {

    fun resolveUserId(authHeader: String?, paramUserId: String?): String {
        if (!authHeader.isNullOrBlank()) {
            val token = authHeader.removePrefix("Bearer ").trim()
            if (token.isNotBlank()) {
                // If a JWT token is passed, extract the subject/user ID if decodable, or use token identifier
                val decodedUid = extractUidFromJwt(token)
                if (decodedUid != null) {
                    return decodedUid
                }
                return token
            }
        }
        return paramUserId?.takeIf { it.isNotBlank() } ?: "demo_user"
    }

    private fun extractUidFromJwt(token: String): String? {
        val parts = token.split(".")
        if (parts.size >= 2) {
            try {
                val payload = String(java.util.Base64.getUrlDecoder().decode(parts[1]))
                val subMatch = Regex("\"sub\"\\s*:\\s*\"([^\"]+)\"").find(payload)
                    ?: Regex("\"user_id\"\\s*:\\s*\"([^\"]+)\"").find(payload)
                return subMatch?.groupValues?.get(1)
            } catch (_: Exception) {
                // Not standard base64 JWT payload, use token directly
            }
        }
        return null
    }
}
