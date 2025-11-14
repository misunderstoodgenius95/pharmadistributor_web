import postgres from "../config/database";
const {Router}=require('express');
const router=Router();
router.get('/products',async(req:any,res:any)=>{
    try {
        const result:any = await postgres.query("SELECT\n" +
            "   *,\n" +
            "    -- Cast the result to NUMERIC before rounding\n" +
            "    ROUND(\n" +
            "            CAST(\n" +
            "                    (CASE\n" +
            "                         WHEN promotion.discount_value IS NOT NULL AND promotion.discount_value > 0 THEN\n" +
            "                             seller_price.price * (1 - promotion.discount_value / 100.0)\n" +
            "                         ELSE\n" +
            "                             seller_price.price\n" +
            "                        END)\n" +
            "                AS NUMERIC),\n" +
            "            2  -- Round to 2 decimal places\n" +
            "    ) AS final_price\n" +
            "FROM\n" +
            "    seller_price\n" +
            "        LEFT JOIN\n" +
            "    promotion ON seller_price.farmaco = promotion.farmaco\n" +
            "inner join farmaco_all on farmaco_all.id=promotion.farmaco;");
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