import {  ref, computed, onMounted, reactive,createApp} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    setup() {
        const input_value = ref('');
        const loading = ref(false);
        let products = ref([]);
        const error = ref('');
        let selectedProduct_value = ref([]);
        const productTotals = reactive({});
        const isEnabled= ref({});
        const payment_mode=ref('');


       async function fetchData() {
            loading.value = true; // Set loading to true when starting
            try {
                console.log('Fetching from API...');
                const response = await fetch('http://localhost:3000/products');
                console.log('Response status:', response.status);
                console.log('Response ok:', response.ok);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
          /*      console.log('Raw API response:', data);
                console.log('Type of data:', typeof data);
                console.log('Is data an array?', Array.isArray(data));*/

                // Check if data is directly an array or nested
              products.value=data;

            } catch (err) {
                console.error('Fetch error:', err);
                error.value = err.message;
                products.value = [];
            } finally {
                loading.value = false;
            }
        }
        // onMounted should be at the top level of setup(), not inside fetchData
        onMounted(() => {
            fetchData();
        });



      const filter_product = computed(() => {
            if (!input_value.value) return products.value;
            return products.value.filter(p =>
                p.nome && p.nome.toLowerCase().includes(input_value.value.toLowerCase())
            );
        });

        const selectProductObjects = computed(() => {
            return selectedProduct_value.value.map(p => get_ProductId(p)).filter(Boolean);
        });

        function get_ProductId(id) {
            return products.value.find(p => p.id === id);
        }






        function getQuantity(event, price, id) {
            let quantity = parseInt(event.target.value) || 0;
            productTotals[id] ={quantity:quantity,
                subtotal:formatCurrency( quantity * price)
            }
            for( let product of products.value){
                let value = product.value || product;
                if(value.id===id){
                    value.qty_selected=quantity;
                    value.subtotal=subtotal;
                }
            }
            console.log(products.value)



            //console.log(`Product ${id} total: ${productTotals[id]}`);
        }

       function enable_checkbox(productId) {
            // Toggle the enabled state for the specific product ID
           this.isEnabled[productId] = !this.isEnabled[productId];

                if (!this.selectedProduct_value.includes(productId)) {
                    this.selectedProduct_value.push(productId);

            } else {
                this.selectedProduct_value = this.selectedProduct_value.filter(id => id !== productId);
            }


        }



        const subtotal = computed(() => {
            return Object.values(productTotals).reduce((sum, item) => {
                const itemSubtotal = parseFloat(item.subtotal) || 0;
                return sum + itemSubtotal;
            }, 0);
        });

        const vat = computed(() => {
            return subtotal.value * 0.20;
        });

        const total = computed(() => {
            return subtotal.value + vat.value;
        });

        function sendOrder() {
            console.log("click")
            // Implementation for sending order
            let order={
                farmacia_id:1,
                products: selectProductObjects.value,
                totals: productTotals,
                payment_mode:payment_mode,
                subtotal: subtotal.value,
                vat: vat.value,
                total: total.value
            };


            let response=fetch('http://localhost:3000/orders',{
                method:'POST',
                header:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(order)
            })
            console.log








        }
         const isTotalNotEmpty=computed(()=>{
         return total.value === 0;

         });
        const formatCurrency = (val) => {
            console.log(val)
            return parseFloat(Math.round(val * 100) / 100);
        };

        return {
            error,
            results: products,
            products, // Also return products directly
            loading,
            filter_product,
            input_value,
            selectedProduct_value,
            selectProductObjects,
            productTotals,
            getQuantity,isEnabled,enable_checkbox,
            subtotal,
            vat,
            total,
            formatCurrency,
            sendOrder,
            fetchData,isTotalNotEmpty
        };
    }
}).mount('#app');