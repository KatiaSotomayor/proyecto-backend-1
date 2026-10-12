import { z } from 'zod';

const isRealDate = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export const createBookingSchema = z.object({
    clientName: z.string({ error: 'clientName es OBLIGATORIO y debe ser texto' })
        .trim()
        .min(1, { error: 'clientName no puede estar vacío' }),
    clientEmail: z.email({ error: 'clientEmail es OBLIGATORIO y debe ser un email válido' }),
    date: z.string({ error: 'date es OBLIGATORIO (formato AAAA-MM-DD)' })
        .refine(isRealDate, { error: 'date debe ser una fecha real con formato AAAA-MM-DD' }),
    time: z.string({ error: 'time es OBLIGATORIO (formato HH:mm)' })
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

export const updateQuantitySchema = z.object({
    quantity: z.number({ error: 'quantity es obligatorio y debe ser un número' })
        .int({ error: 'quantity debe ser un número entero' })
        .positive({ error: 'quantity debe ser mayor a 0' })
});