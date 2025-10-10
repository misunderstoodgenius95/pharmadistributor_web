import postgres from "../config/database";
import {schema} from "../config/order_validate";
import{create_printable} from '../invoice/invoice_printable';
const router=require('express').Router();

const fs=require('fs');



router.post('/order',async(req:any,res:any)=>{
    console.log("Order post")
    console.log(JSON.stringify(req.body, null, 2));
    if(!req.accepts('json')){

        return res.status(406).json({error:"Incorrect format"})
    }
   const{error}=schema.validate(req.body);
    if(error){
        console.log(error)
        return res.status(400).json({error:"Bad Request!"});
    }
    let {farmacia_id,products,subtotal,vat,total,pharma_house,payment_mode}=req.body;
    try {
        await postgres.query('BEGIN')
        const result = await postgres.query('INSERT INTO seller_order (farmacia_id,subtotal,vat,total) VALUES($1,$2,$3,$4)  RETURNING *',
            [farmacia_id, subtotal, vat, total]);
        const id=result.rows[0].id;
        console.log(id);
        const invoice=await postgres.query('INSERT INTO seller_invoice(pharma_house,order_id,payment_mode,subtotal,vat_amount,total) VALUES($1,$2,$3,$4,$5,$6) RETURNING * ',
            [pharma_house,id,payment_mode,subtotal,vat,total]);
        const invoice_id=invoice.rows[0].id;
        const create_at=invoice.rows[0].create_at;
        const emission_date=new Date(create_at).toString();
        for(const product of products){
            await postgres.query('INSERT INTO seller_order_detail(seller_order,price,quantity,vat_percent,farmaco_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
                [id,product.price,product.qty_selected,2,product.id]);
        }
        await postgres.query('COMMIT');
        const invoice_info={
            invoice_number:invoice_id,
            emission_data:emission_date,
            subtotal:subtotal,
            vat:vat,
            total:total
        }
  //      const

       //create_printable(invoice_info,)

        res.status(201).json({
            success:true,
            data:result.rows[0]
        })
    }catch(error){
        await postgres.query('ROLLBACK');
        console.error('Transaction Error'+error);


    }


})
export default router;