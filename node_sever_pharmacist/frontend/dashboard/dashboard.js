// script.js
import { createApp, ref, onMounted, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js';


// Debug imports


createApp({

    setup() {
        const getOffer=()=>{

            return window.location.replace('/node_sever_pharmacist/node_sever_pharmacist/frontend/offer/offer.html')
        }
        const getOrder=()=>{

            return window.location.replace('/node_sever_pharmacist/node_sever_pharmacist/frontend/order/order.html')
        }








        const redirectToLogin = () => {
            localStorage.removeItem('stytch_session_jwt');
            window.location.href = '/node_sever_pharmacist/node_sever_pharmacist/frontend/index/index.html';
        };

        const checkSession = async () => {
            try {
                const token = localStorage.getItem('stytch_session_jwt');
                if (!token) {
                    console.log('No token found');
                    // Commented out for debugging
                     redirectToLogin();
                    return;
                }


            } catch (error) {
                console.error('Session check failed:', error);
                 redirectToLogin();
            }
        };

        onMounted(() => {
            console.log('Component mounted');
            checkSession();
        });

        // Make sure to return all the functions and data the template needs
        return {
          getOffer,getOrder
        };
    } // <-- This closing brace was missing!
}).mount('#app'); // <-- This was completely missing!