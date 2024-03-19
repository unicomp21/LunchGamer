// Function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

// 1. Register a new credential
export async function register() {
    const createCredentialDefaultArgs = {
        publicKey: {
            rp: {name: "Test RP"},
            user: {
                id: new Uint8Array(16),
                name: "test",
                displayName: "Test User"
            },
            pubKeyCredParams: [
                {type: "public-key", alg: -7},
                {type: "public-key", alg: -257},
            ],
            authenticatorSelection: {authenticatorAttachment: "cross-platform"},
            attestation: "direct",
            timeout: 60000,
            challenge: new Uint8Array(16),
            seqno: Math.floor(Math.random() * 1000000), // Added sequence number
            userVerification: "discouraged" // Changed from "preferred" to "discouraged"
        }
    };

    const credential = await navigator.credentials.create(createCredentialDefaultArgs);

    console.log('Credential created:', credential);

    // Convert rawId and attestationObject to Base64 before stringifying
    console.log('Attestation Object ArrayBuffer:', credential.response.attestationObject);
    const rawIdBase64 = arrayBufferToBase64(credential.rawId);
    const attestationObjectBase64 = arrayBufferToBase64(credential.response.attestationObject);

    return JSON.stringify({
        credential: JSON.stringify(credential),
        rawId: rawIdBase64,
        attestationObject: attestationObjectBase64
    });
}

// 2. Authenticate using the registered credential
export async function authenticate(credentialString) {
    // Parse the credential string back into an object
    const {credential: credentialJson, rawId: rawIdBase64} = JSON.parse(credentialString);
    const credential = JSON.parse(credentialJson);

    console.log('Parsed credential:', credential);
    console.log('Parsed rawId:', rawIdBase64);

    // Convert rawId back to ArrayBuffer
    const rawId = base64ToArrayBuffer(rawIdBase64);

    const getCredentialDefaultArgs = {
        publicKey: {
            timeout: 60000,
            rpId: window.location.hostname, // Use the current domain
            allowCredentials: [{
                id: rawId,
                type: "public-key"
            }],
            challenge: new TextEncoder().encode("hello world"),
            userVerification: "discouraged", // Changed from "preferred" to "discouraged"
            seqno: Math.floor(Math.random() * 1000000) // Added sequence number
        }
    };

    const assertion = await navigator.credentials.get(getCredentialDefaultArgs);

    console.log('Assertion:', assertion);

    return JSON.stringify(assertion);
}

// Function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
