// /utils/secureTemplateStore.ts

const DB_NAME = 'nun-secure-store';
const DB_VERSION = 1;
const KEY_STORE_NAME = 'crypto-keys';
const KEY_ALIAS = 'nun_voice_key';
const TEMPLATE_STORAGE_KEY = 'voice_template.dat';

let dbPromise: Promise<IDBDatabase> | null = null;

const getDb = (): Promise<IDBDatabase> => {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(new Error("Failed to open IndexedDB."));
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = () => {
                if (!request.result.objectStoreNames.contains(KEY_STORE_NAME)) {
                    request.result.createObjectStore(KEY_STORE_NAME);
                }
            };
        });
    }
    return dbPromise;
};

const getSecretKey = async (): Promise<CryptoKey> => {
    const db = await getDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(KEY_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(KEY_STORE_NAME);
        const request = store.get(KEY_ALIAS);

        request.onerror = () => reject(request.error);

        request.onsuccess = async () => {
            if (request.result) {
                resolve(request.result);
            } else {
                try {
                    const newKey = await crypto.subtle.generateKey(
                        { name: 'AES-GCM', length: 256 },
                        false, // non-extractable
                        ['encrypt', 'decrypt']
                    );
                    store.put(newKey, KEY_ALIAS);
                    resolve(newKey);
                } catch (e) {
                    reject(e);
                }
            }
        };
    });
};

interface EncryptedData {
    iv: string; // base64
    ciphertext: string; // base64
}

// Helper to convert ArrayBuffer to Base64
const bufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
};

// Helper to convert Base64 to ArrayBuffer
const base64ToBuffer = (base64: string) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};


export const saveVoiceTemplate = async (template: string): Promise<void> => {
    try {
        const key = await getSecretKey();
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedTemplate = new TextEncoder().encode(template);

        const ciphertext = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            encodedTemplate
        );

        const encryptedData: EncryptedData = {
            iv: bufferToBase64(iv),
            ciphertext: bufferToBase64(ciphertext),
        };
        
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(encryptedData));
    } catch (error) {
        console.error("Failed to save voice template securely:", error);
        throw error;
    }
};

export const loadVoiceTemplate = async (): Promise<string | null> => {
    try {
        const encryptedDataString = localStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (!encryptedDataString) {
            return null;
        }

        const encryptedData: EncryptedData = JSON.parse(encryptedDataString);
        const key = await getSecretKey();
        
        const iv = base64ToBuffer(encryptedData.iv);
        const ciphertext = base64ToBuffer(encryptedData.ciphertext);

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
        console.error("Failed to load/decrypt voice template:", error);
        // If decryption fails, it's safer to clear the corrupted data
        localStorage.removeItem(TEMPLATE_STORAGE_KEY);
        return null;
    }
};
