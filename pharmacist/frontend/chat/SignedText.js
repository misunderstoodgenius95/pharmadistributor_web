export function SignedText(){

    const pemToArrayBuffer = (pem) => {
        const pemBody = pem.replace(/-----BEGIN[^-]*-----/, '')
            .replace(/-----END[^-]*-----/, '')
            .replace(/\s/g, '');
        const binaryString = atob(pemBody);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    // Convert base64 to ArrayBuffer
    const base64ToArrayBuffer = (base64) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    // Validate SHA256 signature
    const validateSHA256Signature = async (publicKeyPem, message, signatureBase64) => {
        try {
            // Import the RSA public key
            const keyBuffer = pemToArrayBuffer(publicKeyPem);
            const publicKey = await crypto.subtle.importKey(
                'spki',
                keyBuffer,
                {
                    name: 'RSASSA-PKCS1-v1_5',
                    hash: 'SHA-256'
                },
                false,
                ['verify']
            );

            // Convert message to bytes
            const messageBuffer = new TextEncoder().encode(message);

            // Convert signature from base64 to bytes
            const signatureBuffer = base64ToArrayBuffer(signatureBase64);

            // Verify the signature
            const isValid = await crypto.subtle.verify(
                'RSASSA-PKCS1-v1_5',
                publicKey,
                signatureBuffer,
                messageBuffer
            );

            return isValid;
        } catch (error) {
            console.error('SHA256 signature validation error:', error);
            return false;
        }
    }
    return{
        validateSHA256Signature
    }












}