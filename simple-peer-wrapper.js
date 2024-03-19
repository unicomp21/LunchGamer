// wwwroot/js/peerInterop.js
export async function createPeerAsync(initiator, dotNetObjectReference) {
    try {
        let peer = new SimplePeer({initiator: initiator, trickle: false});

        peer.on('signal', data => {
            console.log('Signal event fired with data:', data);
            dotNetObjectReference.invokeMethodAsync('OnSignal', JSON.stringify(data));
        });

        peer.on('connect', () => {
            console.log('Peer connect event fired');
            dotNetObjectReference.invokeMethodAsync('OnConnect');
        });

        peer.on('data', data => {
            console.log('Data event fired with data:', data.toString());
            dotNetObjectReference.invokeMethodAsync('OnData', data.toString());
        });

        return peer;
    } catch (error) {
        console.error('Error creating peer:', error);
        throw error;
    }
}

export function signalPeer(peer, signal) {
    try {
        console.log('Signaling peer with signal:', signal);
        peer.signal(JSON.parse(signal));
    } catch (error) {
        console.error('Error signaling peer:', error);
        throw error;
    }
}

export function sendToPeer(peer, message) {
    try {
        console.log('Sending message to peer:', message);
        peer.send(message);
    } catch (error) {
        console.error('Error sending message to peer:', error);
        throw error;
    }
}
