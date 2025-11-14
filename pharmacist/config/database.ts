
const{Pool}=require('pg');
const  postgres=new Pool({
    user:'uhsjqweuwjj5stxj1rgm',
    host:'bafminpmzlmmjl5hcxmg-postgresql.services.clever-cloud.com',
    database:'bafminpmzlmmjl5hcxmg',
    password:'MrI9HE6ec0vSPWuNg2GVtv8tKtx8dD',
    port:50013
});



export default postgres;