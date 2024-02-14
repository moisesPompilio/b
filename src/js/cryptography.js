const { subtle } = window.crypto;
const IV_SIZE = 16;
const ITERATIONS = 1000009
const CRYPTOGRAPHY_TYPE = 'AES-GCM'
const HASH_ALGORITHMS = 'SHA-512';
const LENGTH_BITS = 256;

const importKey = async (password) => {
    const salt = generateSalt();
    try {
        const importedKey = await subtle.importKey(
            'raw',
            password,
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: ITERATIONS,
                hash: HASH_ALGORITHMS,
            },
            false,
            ['deriveBits', 'deriveKey']
        );

        return importedKey;
    } catch (error) {
        throw new Error('Erro ao importar chave: ' + error.message);
    }
};

const encryptMessage = async (message, password) => {
    try {
        const key = await importKey(password);

        const derivedKey = await subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: new Uint8Array(0),
                iterations: ITERATIONS,
                hash: HASH_ALGORITHMS,
            },
            key,
            { name: CRYPTOGRAPHY_TYPE, length: LENGTH_BITS },
            true,
            ['encrypt']
        );

        const encryptedBuffer = await subtle.encrypt(
            {
                name: CRYPTOGRAPHY_TYPE,
                iv: new Uint8Array(IV_SIZE),
            },
            derivedKey,
            new TextEncoder().encode(message)
        );

        const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
        const encryptedMessage = encryptedArray.map(byte => byte.toString(IV_SIZE).padStart(2, '0')).join('');
        return encryptedMessage;
    } catch (error) {
        throw new Error('Erro ao criptografar: ' + error.message);
    }
};

const decryptMessage = async (encryptedMessage, password) => {
    try {
        const key = await importKey(password);

        const derivedKey = await subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: new Uint8Array(0),
                iterations: ITERATIONS,
                hash: HASH_ALGORITHMS,
            },
            key,
            { name: CRYPTOGRAPHY_TYPE, length: LENGTH_BITS },
            true,
            ['decrypt']
        );

        const encryptedBuffer = new Uint8Array(
            encryptedMessage.match(/.{1,2}/g).map(byte => parseInt(byte, IV_SIZE))
        ).buffer;

        const decryptedBuffer = await subtle.decrypt(
            {
                name: CRYPTOGRAPHY_TYPE,
                iv: new Uint8Array(IV_SIZE),
            },
            derivedKey,
            encryptedBuffer
        );

        const decryptedMessage = new TextDecoder().decode(decryptedBuffer);
        return decryptedMessage;
    } catch (error) {
        throw new Error('Erro ao descriptografar: ' + error.message);
    }
};

const generateSalt = () => crypto.getRandomValues(new Uint8Array(IV_SIZE));

const submitForm = async () => {
    document.getElementById('result').innerHTML = null;

    const operation = document.getElementById('operation').value;
    const message = document.getElementById('message').value;
    const password = new TextEncoder().encode(document.getElementById('password').value);

    if (operation === 'encrypt') {
        try {
            const encryptedMessage = await encryptMessage(message, password);
            document.getElementById('result').innerHTML = `${encryptedMessage}`;
        } catch (error) {
            console.error(error.message);
        }
    } else {
        try {
            const decryptedMessage = await decryptMessage(message, password);
            document.getElementById('result').innerHTML = `${decryptedMessage}`;
        } catch (error) {
            console.error(error.message);
        }
    }

    toggleCopyButton( "result", "resultContainer" )
};

document.getElementById('cryptoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm();
});