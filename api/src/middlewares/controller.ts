import { Handler } from 'express';

// Syntax sugar wrapper ;)
export default function controller(middleware: Handler): Handler {
    return middleware
}
