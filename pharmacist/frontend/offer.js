const {createApp,ref,computed,watch}=Vue
const { createPinia } = Pinia;
import { useAuthStore } from './pinia/pinia.js ';

const pinia = createPinia();




const app=createApp({
setup() {
    const authStore = useAuthStore();
    const categories = ref((['Tutti','Antibiotico','AntiDepressivo','Ansiolitici','Antipertensivo']))
    const activeCategory=ref("Tutti");
    const filterDrug = ref([]);
    const cart=ref([]);
    const isDisabled=ref(true);
    const farmacia=ref(sessionStorage.getItem("pharmacy_id"))
    const isDialogSuccess=ref(false);
    const fetchData = async (category) => {
        try {
            // Update activeCategory when button is clicked
            activeCategory.value = category;

            let response;
            console.log("Fetching category:", category);

            if (category === "Tutti") {
                response = await fetch("http://localhost:3000/drug");
            } else {
                response = await fetch("http://localhost:3000/drug?category=" + category);
            }



           const data_value = await response.json();
            console.log(data_value);
            const data=JSON.parse(data_value);

            // THIS WAS MISSING - assign data to filterDrug
            filterDrug.value = data;

            console.log("Fetched drugs:", data);
            console.log("Number of drugs:", data.length);

        } catch (error) {
            console.error("Error fetching drugs:", error);
            filterDrug.value = [];
        }
    };
        const change_Date=(change_Date)=> {

            const date = new Date(change_Date);
            return date.toLocaleDateString('en-GB');
        };
    const closeDialog=()=>{
        isDialogSuccess.value=false;
        window.location.reload();
    }
        const addToCart=(drug)=>{
            console.log(drug)
            const existItem=cart.value.find(item=>item.farmaco_id===drug.farmaco_id);
                if (existItem){
                    existItem.quantity++;

                }else{
                    cart.value.push({...drug,quantity:1})
                }
                isDisabled.value=false;
        };
        const decreaseQty=(index)=> {
            if (cart.value[index].quantity > 1) {
                cart.value[index].quantity--;
            }
        }
            const increaseQty = (index) => {
                cart.value[index].quantity++;
            }
            const item_remove = (index) => {
                cart.value.splice(index, 1)

            };
            const subtotal = computed(() => {
                return cart.value.reduce((sum, item) => sum + (item.final_price * item.quantity), 0)


            });
            const tax=computed(()=>{
                return (subtotal.value*0.20).toFixed(2);
            })
            const total=computed(()=>{
                return (parseFloat(subtotal.value)+parseFloat(tax.value)).toFixed(2);


            })
            const sendOrder=(async (e)=>{
                    const order_data={
                        farmacia_id:farmacia.value,
                        subtotal: parseFloat(subtotal.value),
                        total: parseFloat(total.value),
                        vat: tax.value,
                        payment_mode:"BONIFICO",
                        products: cart.value.map(item => ({
                            id: parseInt(item.farmaco_id),
                            final_price: parseFloat(item.final_price),
                            qty_selected: parseInt(item.quantity),
                            vat_percent: parseInt(item.vat_percent || 22),
                            pharma_id: parseInt(item.pharma_id || farmacia.value)
                        }))
                    }

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

            });

    const logout= async ()=>{
        await authStore.logout();
        redirectToLogin();
    }
    const redirectToLogin = () => {
        window.location.href = '/pharmacist/frontend/index.html';
    };




            return{
        categories,logout,isDialogSuccess,activeCategory,filterDrug,fetchData,change_Date,cart,addToCart,increaseQty,decreaseQty,item_remove,subtotal,tax,total,isDisabled,sendOrder
    }
}



});
app.use(pinia);
app.mount('#app');