import { ref, computed, readonly } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.min.js';
import { ChaCha20Poly1305 } from 'https://cdn.jsdelivr.net/npm/@stablelib/chacha20poly1305@2.0.1/+esm';

export function useChaCha20() {
    // Internal state
    const error = ref('');
    const isLoading = ref(false);

    // Utility functions
    const byteToHex = (bytes) => {
        if (!bytes || (!Array.isArray(bytes) && !(bytes instanceof Uint8Array))) {
            return new Error("Error");
        }
        return Array.from(bytes, b => (b & 0xFF).toString(16).padStart(2, '0')).join('');
    };

    const hexToByte = (hex) => {
        if (typeof hex !== "string" || hex.length === 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
            throw new Error("Invalid hex string");
        }
        if (hex.length % 2 !== 0) {
            throw new Error("Hex string length must be even");
        }
        return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    };

    const currentKey = ref("8ea690edf585aaeb422a67410aff3a46ab996418db3708ec526587d092ec7e69");
    const generateNonce = () => {
        const nonce = new Uint8Array(12);
        crypto.getRandomValues(nonce);
        return byteToHex(nonce);
    };
    const cipher = computed(() => {
        try {
            if (!currentKey.value) return null;
            const keyBytes = hexToByte(currentKey.value);
            if (keyBytes.length !== 32) {
                throw new Error("Key must be exactly 32 bytes (64 hex characters)");
            }
            return new ChaCha20Poly1305(keyBytes);
        } catch (err) {
            error.value = `Invalid key: ${err.message}`;
            return null;
        }
    });
    const isValidHex = (hex) => {
        return typeof hex === 'string' &&
            hex.length > 0 &&
            hex.length % 2 === 0 &&
            /^[0-9a-fA-F]+$/.test(hex);
    };

    const encrypt = async (message) => {
        try {
            error.value = '';
            isLoading.value = true;

            // Input validation
            if (!message || typeof message !== 'string') {
                throw new Error('Message must be a non-empty string');
            }

            if (!cipher.value) {
                throw new Error('Invalid cipher - check your key');
            }

            // Generate or use custom nonce
            const nonceHex = generateNonce();
            const nonceBytes = hexToByte(nonceHex);

            if (nonceBytes.length !== 12) {
                throw new Error('Nonce must be exactly 12 bytes (24 hex characters)');
            }

            // Convert message to bytes
            const messageBytes = new TextEncoder().encode(message);

            // Encrypt the message
            const encryptedBytes = cipher.value.seal(nonceBytes, messageBytes);

            // Return structured data
            return JSON.stringify({
                cipherText: byteToHex(encryptedBytes),
                nonce: nonceHex,
                timestamp: Date.now(),
                algorithm: 'ChaCha20-Poly1305',
                version: '1.0'
            });

        } catch (err) {
            error.value = `Encryption failed: ${err.message}`;
            throw err;
        } finally {
            isLoading.value = false;
        }
    }; // DECRYPT
    // Core decryption function
    const decrypt = async (encryptedData) => {
        try {
            console.log("decrypt() INPUT =", encryptedData);
            error.value = '';
            isLoading.value = true;

            // Handle different input formats
            let dataObject;

            // If it's already an object, use it directly
            if (encryptedData && typeof encryptedData === 'object' && !Array.isArray(encryptedData)) {
                dataObject = encryptedData;
            }
            // If it's a string, try to parse it
            else if (typeof encryptedData === 'string') {
                try {
                    dataObject = JSON.parse(encryptedData);
                } catch (parseErr) {
                    throw new Error('Invalid JSON string: ' + parseErr.message);
                }
            }
            // Invalid input type
            else {
                throw new Error(`Invalid encrypted data format: expected object or JSON string, got ${typeof encryptedData}`);
            }

            // Extract required fields
            const { cipherText, nonce } = dataObject;

            if (!cipherText || !nonce) {
                throw new Error('Missing cipherText or nonce in encrypted data');
            }

            // Validate hex strings before conversion
            if (!isValidHex(cipherText)) {
                throw new Error('Invalid cipherText: not a valid hex string');
            }

            if (!isValidHex(nonce)) {
                throw new Error('Invalid nonce: not a valid hex string');
            }

            // Get cipher instance
            const cipherInstance = cipher.value;
            if (!cipherInstance) {
                throw new Error('Invalid cipher instance - check your key');
            }

            // Convert hex to bytes
            const cipherTextBytes = hexToByte(cipherText);
            const nonceBytes = hexToByte(nonce);

            // Validate lengths
            if (nonceBytes.length !== 12) {
                throw new Error(`Invalid nonce length: expected 12 bytes, got ${nonceBytes.length}`);
            }

            // Decrypt
            const decryptedBytes = cipherInstance.open(nonceBytes, cipherTextBytes);

            if (!decryptedBytes) {
                throw new Error('Decryption failed - invalid ciphertext, nonce, or key. Data may be corrupted or tampered with.');
            }

            // Convert bytes back to string
            return new TextDecoder().decode(decryptedBytes);

        } catch (err) {
            error.value = `Decryption failed: ${err.message}`;
            console.error('Decryption error details:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };
    return{
        encrypt,decrypt
    }








}