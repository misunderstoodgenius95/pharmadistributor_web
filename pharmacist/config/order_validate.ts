// @ts-ignore

import Joi = require('joi');
const schema=Joi.object({
    farmacia_id:Joi.number().integer().required(),
    subtotal:Joi.number().required(),
    total:Joi.number().required(),
    vat:Joi.number().required(),
    payment_mode:Joi.string().required(),
    products: Joi.array().items(
        Joi.object({
            id: Joi.number().integer().required(),
            final_price: Joi.number().positive().required(),
            qty_selected: Joi.number().integer().min(1).required(),
            vat_percent: Joi.number().min(0).max(100).required(),
            pharma_id:Joi.number().integer().required()
        })).min(1).required()
});
export{schema};