import { z } from 'zod';

export const createBookingSchema = z.object({
    clientName: z.string({ error: 'clientName es obligatorio y debe ser texto' })
        .trim()
        .min(1, { error: 'clientName no puede estar vacío' }),
    clientEmail: z.email({ error: 'clientEmail es obligatorio y debe ser un email válido' }),
    date: z.string({ error: 'date es obligatorio (formato AAAA-MM-DD)' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { error: 'date debe tener formato AAAA-MM-DD' })
        .refine(value => !Number.isNaN(Date.parse(value)), { error: 'date no es una fecha válida' }),
    time: z.string({ error: 'time es obligatorio (formato HH:mm)' })
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, { error: 'time debe tener formato HH:mm, por ejemplo 10:00' }),
    status: z.enum(['pending', 'confirmed', 'cancelled'], {
        error: 'status debe ser pending, confirmed o cancelled'
    }).optional()
});


export const addServiceToBookingSchema = z.object({
    quantity: z.number({ error: 'quantity debe ser un número' })
        .int({ error: 'quantity debe ser un número entero' })
        .positive({ error: 'quantity debe ser mayor a 0' })
        .optional()
});