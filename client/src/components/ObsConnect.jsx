import React, { useEffect, useState } from 'react';
import OBSWebSocket from 'obs-websocket-js';

const OBSWebSocketComponent = ({ address, password, port }) => {
    const [obsConnected, setObsConnected] = useState(false);
    const [obs, setObs] = useState(null);
    const [screenshotData, setScreenshotData] = useState(null);

    useEffect(() => {
        let screenshotInterval;

        const handleCaptureScreenshot = () => {
            if (obs) {
                obs.call('GetSourceScreenshot', { sourceName: 'Clipr_Auto_Generated_Scene', imageFormat: 'jpg' })
                    .then((data) => {
                        setScreenshotData(data.imageData);
                    })
                    .catch((error) => {
                        console.error('Error capturing screenshot:', error);
                    });
            }
        };

        screenshotInterval = setInterval(handleCaptureScreenshot, 30);

        return () => {
            clearInterval(screenshotInterval);
        };
    }, [obs]); 

    useEffect(() => {
        let heartbeatInterval = null;

        const connect = async () => {
            address = address || `ws://localhost:${port}`;
            if (address.indexOf('://') === -1) {
                const secure =
                    window.location.protocol === 'https:' || address.endsWith(':443');
                address = secure ? 'wss://' : 'ws://' + address;
            }

            console.log('Connecting to:', address, '- using password:', password);
            await disconnect();

            const obsInstance = new OBSWebSocket();
            try {
                const { obsWebSocketVersion, negotiatedRpcVersion } = await obsInstance.connect(
                    address,
                    password
                );
                console.log(
                    `Connected to obs-websocket version ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`
                );
                setObs(obsInstance);
                setObsConnected(true);
                
            } catch (error) {
                console.error(error);
                setObsConnected(false);
            }
        };

        const disconnect = async () => {
            if (!obs) return;
            await obs.disconnect();
            clearInterval(heartbeatInterval);
            setObsConnected(false);
        };

        connect();

        return () => {
            disconnect();
        };
    }, [address, password, port]);

    return (
        <div>
            {screenshotData && <img src={screenshotData} alt="Captured Screenshot" />}
        </div>
    );
};

export default OBSWebSocketComponent;
