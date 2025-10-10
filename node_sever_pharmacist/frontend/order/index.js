import { createApp, ref, onMounted, computed } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
createApp({
 setup(){
     const products = ref([]);
     const selects=ref([{productId:'',quantity:1}]);
     const isDisable=ref(true);


 const btn_add=((e)=>{

     selects.value.push({ productId: '', quantity: 1 });
 });

     const getItemVat = (item) => {
         if (!item.productId) return '0.00';
         const product = products.value.find(p => p.id == item.productId);
         if (product && item.quantity > 0) {
             const subtotal = product.price * item.quantity;
             return ((subtotal * 22) / 100).toFixed(2); // 22% IVA
         }
         return '0.00';
     };
     const getItemSubtotal = (item) => {
         const product = products.value.find(p => p.id == item.productId);
         if (product && item.quantity > 0) {
             return (product.price * item.quantity).toFixed(2);
         }
         return '0.00';
     };
     const handleProductChange=(select,index)=>{
         console.log("it is change")
         isDisable.value=false;


     }
const getProductPrice=(productId)=>{
    const product=products.value.find(p=>p.id == productId);
    return product? product.price.toFixed(2):'0.0';
}


     const send_btn=((e)=>{




     });
     const grandSubtotal = computed(() => {
        return  selects.value.reduce((sum,item)=>{
           if (!item.productId) return sum
        const product=products.value.find(p=>p.id == item.productId)
            if (product && item.quantity>0 ){
                return  sum+product.price*item.quantity.toFixed(2)
            }

        },0)
     });


     const grandVat = computed(() => {
         return ((grandSubtotal.value * 22) / 100);
     });


     const grandTotal = computed(() => {
         return (grandSubtotal.value + grandVat.value);
     });

onMounted(async()=>{

    try{


    let response= await fetch("http://localhost:3000/products");

    let data=await response.json();
    products.value=data;
    console.log(data)
    }catch (error){
    console.log("Errror fetching");
}








     })




return{
    products,btn_add,selects,send_btn,isDisable,getProductPrice,getItemSubtotal,getItemVat,handleProductChange,
    grandSubtotal,grandTotal,grandVat
}
 }












}).mount('#app')