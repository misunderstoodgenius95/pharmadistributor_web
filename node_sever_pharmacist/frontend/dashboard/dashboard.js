// script.js
const { createApp, ref, onMounted,watch,computed } = Vue;
const { createPinia } = Pinia;
import { useAuthStore } from '../pinia/pinia.js ';

// Debug imports

const pinia = createPinia();

const app=createApp({

    setup() {
        const authStore = useAuthStore();
        const getOffer=()=>{

            return window.location.replace('/node_sever_pharmacist/node_sever_pharmacist/frontend/offer/offer.html')
        }
        const getOrder=()=>{

            return window.location.replace('/node_sever_pharmacist/node_sever_pharmacist/frontend/order/order.html')
        }

        const redirectToLogin = () => {
            window.location.href = '/node_sever_pharmacist/node_sever_pharmacist/frontend/index/index.html';
        };
        const logout= async ()=>{
            await authStore.logout();
            redirectToLogin();
        }

        // Make sure to return all the functions and data the template needs
        return {
          getOffer,getOrder,logout
        };
    } // <-- This closing brace was missing!

});
app.use(pinia);
app.mount('#app');