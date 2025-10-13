import postgres from "../config/database";
const {Router}=require('express');
const router=Router();
router.get('/products',async(req:any,res:any)=>{
    try {
        const result:any = await postgres.query('select  * from seller_price\n' +
            'inner join farmaco_all on farmaco_all.id=farmaco ');
        console.log(result)
        const farmacoWithPrice = result.rows.map(farmaco => ({
            ...farmaco
        }));
        console.log(farmacoWithPrice);
        res.json(farmacoWithPrice);
    }catch (err){
        console.log(err);
        res.sendStatus(500);
    }





});
export default router;