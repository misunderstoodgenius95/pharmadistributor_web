import postgres from "../config/database";
const {Router}=require('express');
const router=Router();
router.get('/products',async(req:any,res:any)=>{
    try {
        const result:any = await postgres.query('SELECT * FROM farmaco_all');
        const farmacoWithPrice = result.rows.map(farmaco => ({
            ...farmaco,
            price: parseFloat((Math.random() * 45).toFixed(2))
        }));
        console.log(farmacoWithPrice);
        res.json(farmacoWithPrice);
    }catch (err){
        console.log(err);
        res.sendStatus(500);
    }





});
export default router;