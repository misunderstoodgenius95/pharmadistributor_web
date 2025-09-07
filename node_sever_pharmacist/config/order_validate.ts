// @ts-ignore

import Joi = require('joi');
const schema=Joi.object({
    farmacia_id:Joi.number().integer().required(),
    subtotal:Joi.number().integer().required(),
    total:Joi.number().integer().required(),
    vat:Joi.number().integer().required(),
    pharma_house:Joi.number().integer().required(),
    products: Joi.array().items(
        Joi.object({
            id: Joi.number().integer().required(),
            price: Joi.number().positive().required(),
            qty_selected: Joi.number().integer().min(1).required(),
            vat_percent: Joi.number().min(0).max(100).required(),
        })).min(1).required()
});
export{schema};