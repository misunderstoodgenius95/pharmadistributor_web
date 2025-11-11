import { createApp, ref, onMounted, computed,reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
 setup() {
     const products = ref([]);
     const selects = ref([{productId: '', quantity: 1}]);
     const isDisable = ref(true);
     const farmacia = ref(1);
     const payment_mode = ref('');
     const isDialogSuccess=ref(false);
     const errors = reactive({
         payment_mode: ''
     });

const closeDialog=()=>{
    isDialogSuccess.value=false;
    window.location.reload();
}
     const btn_add = ((e) => {
         selects.value.push({productId: '', quantity: 1});
     });

// Calculate Subtotal for each items
     const getItemSubtotal = (item) => {
         const product = products.value.find(p => p.id == item.productId);
         if (product && item.quantity > 0) {
             return (product.final_price * item.quantity).toFixed(2);
         }
         return '0.00';
     };
     //Calculate Vat for each items
     const getItemVat = (item) => {
         if (!item.productId) return '0.00';
         const product = products.value.find(p => p.id == item.productId);
         if (product && item.quantity > 0) {
             const subtotal=getItemSubtotal(item);
             let vat= ((subtotal * product.vat_percent) / 100).toFixed(2);
             return vat;
         }
         return '0.00';
     };


// When it can be choice it can be send order
     const handleProductChange = (select, index) => {
         console.log("it is change")
         isDisable.value = false;


     }
     const getProductPrice = (productId) => {
         const product = products.value.find(p => p.id == productId);
         return product ? product.final_price : '0.0';
     }
     const validatePaymentMode = () => {
         if (!payment_mode.value || payment_mode.value.trim() === '') {
             errors.payment_mode = 'Il metodo di pagamento è obbligatorio';
             return false;
         }
         errors.payment_mode = '';
         return true;
     };



     const send_btn = (async (e) => {
         console.log(e)
         if (validatePaymentMode()) {

             const order_data = {
                 farmacia_id: farmacia.value,
                 subtotal: parseFloat(grandSubtotal.value.toFixed(2)),
                 total: parseFloat(grandTotal.value.toFixed(2)),
                 vat: grandVat.value,
                 payment_mode: payment_mode.value,
                 products: selects.value.map(item => {
                     const product = products.value.find(p => p.id == item.productId);
                     return {
                         id: parseInt(item.productId),
                         final_price: product ? parseFloat(product.final_price) : 0,
                         qty_selected: parseInt(item.quantity),
                         vat_percent: parseInt(product.vat_percent),
                         pharma_id: parseInt(product.pharma_id)
                     };
                 }),
             };


             const response = await fetch('http://localhost:3000/order', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(order_data)
             })

             if (response.status===201){
                 isDialogSuccess.value=true;

             }
         }
     }
     );




         const grandSubtotal = computed(() => {
             return selects.value.reduce((sum, item) => {
                 if (!item.productId) return sum
                 const product = products.value.find(p => p.id == item.productId)
                 if (product && item.quantity > 0) {
                     return sum + product.final_price * item.quantity.toFixed(2)
                 }

             }, 0)
         });

         const grandVat = computed(() => {
             return selects.value.reduce((sum,item)=>{
                 const product=products.value.find(p=>p.id ==item.productId);
                 if (product&& item.quantity >0){
                     const subtotal=product.final_price*item.quantity;
                     const itemVat=(subtotal*product.vat_percent)/100
                     return sum+itemVat
                 }return sum},0);

         });


         const grandTotal = computed(() => {
             return (grandSubtotal.value + grandVat.value);
         });
         onMounted(async () => {

             try {
                 let response = await fetch("http://localhost:3000/products");
                 let data = await response.json();
                 products.value = data;
                 console.log(data)
             } catch (error) {
                 console.log("Errror fetching");
             }


         })





     return {
         products,
         btn_add,
         selects,
         send_btn,
         isDisable,
         getProductPrice,
         getItemSubtotal,
         getItemVat,
         payment_mode,
         handleProductChange,
         grandSubtotal,
         grandTotal,
         grandVat,errors,isDialogSuccess,closeDialog
     }
 }





}).mount('#app')