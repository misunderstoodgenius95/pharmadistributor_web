
import { reactive,ref } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js';

export const Offer={
    emits: ['close'],
    template: `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h2 class="text-xl font-semibold mb-4 text-purple-600">Offer Modal</h2>
                <p class="mb-4">This is a placeholder for the Offer modal content.</p>
                <button @click="$emit('close')" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    `
};