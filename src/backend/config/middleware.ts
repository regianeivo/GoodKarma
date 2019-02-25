import * as express from "express";
import jwt from "jsonwebtoken";

// Middleware function used for JWT token validation
export function authMiddleware(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // Read token signature from environment variables
    const AUTH_SECRET = process.env.AUTH_SECRET;
    // Read token from request headers
    const token = req.headers["x-auth-token"];
    // Client error if no token found in request headers
    if (typeof token !== "string") {
        res.status(400).send();
    } else {
        // Server error is enironment variable is not set
        if (AUTH_SECRET === undefined) {
            res.status(500).send();
        } else {
            try {
                // Check that the token is valid
                const obj = jwt.verify(token, AUTH_SECRET) as any;
                // Add the user ID to the HTTP request object so we can access it from the NEXT request handler
                (req as any).userId = obj.id;
                // Invoke NEXT request handler
                next();
            } catch(err) {
                // Unauthorized if the token cannot be verified
                console.log("error");
                res.status(401).send('user not authorized');
            }
        }
    }
}