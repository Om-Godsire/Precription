import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
    console.error(`[ERROR] ${err.message}`, err.stack);

    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }

    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
        return;
    }

    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
    });
};
