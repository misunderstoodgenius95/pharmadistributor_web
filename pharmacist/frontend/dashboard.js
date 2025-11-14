// script.js
const { createApp, ref, onMounted,watch,computed } = Vue;
const { createPinia } = Pinia;
import { useAuthStore } from '../frontend/pinia/pinia.js';

// Debug imports

const pinia = createPinia();

const app=createApp({

    setup() {
        const authStore = useAuthStore();
        const getOffer=()=>{

            return window.location.replace('offer.html')
        }
        const getOrder=()=>{

            return window.location.replace('order.html')
        }
        const getchat=()=>{

            return window.location.replace("chat.html")

        }

        const redirectToLogin = () => {
            window.location.href = '/pharmacist/frontend/index.html';
        };
        const logout= async ()=>{
            await authStore.logout();
            redirectToLogin();
        }

        // Make sure to return all the functions and data the template needs
        return {
          getOffer,getOrder,logout,getchat
        };
    } // <-- This closing brace was missing!

});
app.use(pinia);
app.mount('#app');