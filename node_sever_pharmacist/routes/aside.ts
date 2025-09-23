const router=require('express').Router();
const fs=require('fs');
router.get('/aside',async(req:any,res:any)=> {
    try {
        const data = fs.readFileSync("frontend/aside.html");
        res.set("Content-Type", 'text/html');
        return res.send(data);

    } catch (error) {
        return res.status(404).send('File Not Found');
    }
});
export  default router;

