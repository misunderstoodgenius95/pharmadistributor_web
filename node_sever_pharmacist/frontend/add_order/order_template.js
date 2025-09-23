import { reactive, ref, onMounted, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js';

export const Order = {
    template: `
        <div class="order-component">
            <main>
                <div class="header_table">
                    <input
                        type="text"
                        v-model="input_value"
                        placeholder="Cerca il prodotto per nome"
                        style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 4px;"
                    >
                    
                    <div v-if="loading" style="text-align: center; padding: 20px;">
                        <p>⏳ Caricamento prodotti...</p>
                    </div>
                    
                    <div v-if="error" style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0;">
                        <strong>❌ Errore:</strong> {{ error }}
                    </div>
                    
                    <table class="display" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Id</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Nome</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Categoria</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Tipologia</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Misura</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Casa Farmaceutica</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Prezzo</th>
                                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">IVA</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Quantità</th>
                                 
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Seleziona</th>
                             
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Quantità Ordine</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Totale</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="result in filter_product" :key="result.id">
                                <td style="border: 1px solid #ddd; padding: 8px;">{{ result.id }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">{{ result.nome }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">{{ result.categoria }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">{{ result.tipologia }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">{{ result.misura }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">{{ result.casa_farmaceutica }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">€{{ result.price }}</td>
                                   <td style="border: 1px solid #ddd; padding: 8px;">{{ result.vat_percent }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">{{ result.qty }}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">
                                    <input 
                                        type="checkbox"   
                                        @click="enable_checkbox(result.id)"    
                                        name="productGroup" 
                                        v-model="selectedProduct_value"  
                                        :value="result.id"  
                                        class="radio_product"
                                    >
                                </td>
                           
                                <td style="border: 1px solid #ddd; padding: 8px;">
                                    <input 
                                        type="number"  
                                        :disabled="!isEnabled[result.id]" 
                                        min="0" 
                                        @input="getQuantity($event, result.price, result.id)"
                                        style="width: 80px; padding: 4px;"
                                    >
                                </td>
                                <td style="border: 1px solid #ddd; padding: 8px;">
                                    <span>€{{ productTotals[result.id]?.subtotal || 0 }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <input v-model="payment_mode" type="text" placeholder="Modalità di pagamento">
                <div class="order_fields" style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <span class="calculate_value" style="font-weight: bold;">Subtotal: €{{ formatCurrency(subtotal) }}</span>
                        <span class="calculate_value" style="font-weight: bold;">IVA (20%): €{{ formatCurrency(vat) }}</span>
                        <span class="calculate_value" style="font-weight: bold; color: #007bff;">Totale: €{{ formatCurrency(total) }}</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <button  
                        :disabled="isTotalNotEmpty"
                        class="order_btn" 
                        @click.prevent="sendOrder()"
                        style="background: #28a745; color: white; border: none; padding: 15px 30px; font-size: 16px; border-radius: 4px; cursor: pointer; transition: background 0.3s;"
                        :style="{ opacity: isTotalNotEmpty ? 0.5 : 1, cursor: isTotalNotEmpty ? 'not-allowed' : 'pointer' }"
                    >
                        📦 Invia Ordine (€{{ formatCurrency(total) }})
                    </button>
                </div>
            </main>
        </div>
    `,

    setup() {
        const input_value = ref('');
        const loading = ref(false);
        const products = ref([]);
        const error = ref('');
        const selectedProduct_value = ref([]);
        const productTotals = reactive({});
        const isEnabled = reactive({});
        const payment_mode = ref('');

        async function fetchData() {
            loading.value = true;
            try {
                console.log('Fetching products from API...');
                const response = await fetch('http://localhost:3000/products');
                console.log("product: "+JSON.stringify(response))

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                products.value = data;
                console.log('Products loaded:', data.length);
            } catch (err) {
                console.error('Fetch error:', err);
                error.value = err.message;
                products.value = [];
            } finally {
                loading.value = false;
            }
        }

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
            return selectedProduct_value.value.map(id => get_ProductId(id)).filter(Boolean);
        });

        function get_ProductId(id) {
            return products.value.find(p => p.id === id);
        }

        function getQuantity(event, price, id) {
            const quantity = parseInt(event.target.value) || 0;
            productTotals[id] = {
                quantity: quantity,
                subtotal: quantity * price
            };

            // Update product with selected quantity
            const product = products.value.find(p => p.id === id);
            if (product) {
                product.qty_selected = quantity;
            }
        }

        function enable_checkbox(productId) {
            // Toggle the enabled state for the specific product ID
            isEnabled[productId] = !isEnabled[productId];

            if (!selectedProduct_value.value.includes(productId)) {
                selectedProduct_value.value.push(productId);
            } else {
                selectedProduct_value.value = selectedProduct_value.value.filter(id => id !== productId);
                // Clear totals when unchecked
                delete productTotals[productId];
            }
        }

        const subtotal = computed(() => {
            return Object.values(productTotals).reduce((sum, item) => {
                return sum + (item.subtotal || 0);
            }, 0);
        });

        const vat = computed(() => {
            return subtotal.value * 0.20;
        });

        const total = computed(() => {
            return subtotal.value + vat.value;
        });

        async function sendOrder() {
            try {
                const filteredObjects = selectProductObjects.value.map(({ id, price, qty_selected, vat_percent, pharma_id }) => ({
                    id,
                    price,
                    qty_selected,
                    vat_percent,
                    pharma_id
                }));

                const order = {
                    farmacia_id: 1,
                    products: filteredObjects,
                    payment_mode: payment_mode.value,
                    subtotal: subtotal.value,
                    vat: vat.value,
                    total: total.value
                };

                console.log('Sending order:', order);

                const response = await fetch('http://localhost:3000/order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(order)
                });

                if (response.ok) {
                    alert('✅ Ordine inviato con successo!');
                    // Reset form
                    selectedProduct_value.value = [];
                    Object.keys(productTotals).forEach(key => delete productTotals[key]);
                    Object.keys(isEnabled).forEach(key => delete isEnabled[key]);
                    payment_mode.value = '';
                } else {
                    throw new Error('Errore nell\'invio dell\'ordine');
                }
            } catch (err) {
                console.error('Error sending order:', err);
                alert('❌ Errore nell\'invio dell\'ordine: ' + err.message);
            }
        }

        const isTotalNotEmpty = computed(() => {
            return total.value === 0;
        });

        const formatCurrency = (val) => {
            return parseFloat(Math.round((val || 0) * 100) / 100).toFixed(2);
        };

        return {
            error,
            products,
            loading,
            filter_product,
            input_value,
            selectedProduct_value,
            selectProductObjects,
            productTotals,
            getQuantity,
            isEnabled,
            enable_checkbox,
            subtotal,
            vat,
            total,
            formatCurrency,
            sendOrder,
            fetchData,
            isTotalNotEmpty,
            payment_mode
        };
    }
};