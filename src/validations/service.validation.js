import { z } from 'zod';

const requiredText = field =>
    z.string({ error: `Campo ${field} es OBLIGATORIO y debe ser de tipo texto` })
        .trim()
        .min(1, { error: `Campo ${field} no puede estar vacío` });

const positiveInt = field => {
    const message = `Campo ${field} debe ser un número entero mayor a 0`;
    return z.coerce.number({ error: message }).int({ error: message }).positive({ error: message });
};

export const createServiceSchema = z.object({
    name: requiredText('name'),
    description: requiredText('description'),
    duration: z.number({ error: 'duration es obligatorio y debe ser un número' })
        .positive({ error: 'duration debe ser mayor a 0' }),
    price: z.number({ error: 'price es obligatorio y debe ser un número' })
        .min(0, { error: 'price no puede ser negativo' }),
    category: requiredText('category'),
    available: z.boolean({ error: 'available debe ser true o false' }).optional()
});

export const updateServiceSchema = createServiceSchema
    .partial()
    .refine(data => Object.keys(data).length > 0, { error: 'Enviá al menos un campo para actualizar' });


export const listServicesQuerySchema = z.object({
    category: z.string().trim().min(1, { error: 'category no puede estar vacío' }).optional(),
    available: z.enum(['true', 'false'], { error: "available debe ser 'true' o 'false'" }).optional(),
    page: positiveInt('page').optional(),
    limit: positiveInt('limit').max(100, { error: 'limit no puede superar 100' }).optional(),
    sortBy: z.enum(['price', 'duration', 'name'], { error: 'sortBy debe ser price, duration o name' }).optional(),
    order: z.enum(['asc', 'desc'], { error: "order debe ser 'asc' o 'desc'" }).optional()
});