// script.js
import { createApp, ref, onMounted, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js';
import { Order } from '../add_order/order_template.js';
import { Offer } from '../offer/offer.js';

// Debug imports
console.log('Order component:', Order);
console.log('Offer component:', Offer);

createApp({
    components: {
        Order,
        Offer
    },
    setup() {
        const currentPage = ref('order');

        // Fixed the computed logic - it was backwards
        const currentComponent = computed(() => {
            console.log('Current page:', currentPage.value);
            // Return the correct component name based on currentPage
            return currentPage.value === 'offer' ? 'Offer' : 'Order';
        });

        const setCurrentPage = (page) => {
            console.log("Setting current page to:", page);
            currentPage.value = page;
        };

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
            currentPage,
            currentComponent,
            setCurrentPage
        };
    } // <-- This closing brace was missing!
}).mount('#app'); // <-- This was completely missing!