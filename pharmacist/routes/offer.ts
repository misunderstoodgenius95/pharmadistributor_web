const router=require('express').Router();
import postgres from "../config/database";
router.get("/drug",async (req,res)=>{
    const category=req.query.category;
    let result=null;
    if(category) {
        result = await postgres.query("SELECT * FROM promotion_discount where categoria= $1 and range_time_end > CURRENT_DATE ", [category]);
    }else{
        result = await postgres.query("SELECT * FROM promotion_discount WHERE range_time_end > CURRENT_DATE;");
    }
    res.json(JSON.stringify(result.rows));


})





export default router;