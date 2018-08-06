(function () {
    var MessageName = {
        GetLoginInformation: "GetLoginInformation",
        GetLoginInformationCallback: "GetLoginInformationCallback",
        PayBasket: "PayBasket",
        PayBasketCallback: "PayBasketCallback",
        BarcodeScanned: "BarcodeScanned",
        OpenURL: "OpenURL",
        OpenURLCallback: "OpenURLCallback",
        PrintDocumentAtURL: "PrintDocumentAtURL",
        PrintDocumentWithData: "PrintDocumentWithData",
        PrintDocumentCallback: "PrintDocumentCallback",
        SendPOSConnectorObjectPathToPOS: "SendPOSConnectorObjectPathToPOS",
        SendPOSConnectorObjectPathToPOSCallback: "SendPOSConnectorObjectPathToPOSCallback"
    };

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    var POSSimulate = {
        pos: "POSConnector",
        postMessage: function (message) {
            console.log("[POS Simulator]: Received message: ", message);
            var callbackMessage;
            switch (message.name) {
                case MessageName.PayBasket:
                    callbackMessage = {
                        name: MessageName.PayBasketCallback,
                        body: {result: true, error: null},
                        callbackId: message.callbackId
                    };
                    break;
                case MessageName.GetLoginInformation:
                    callbackMessage = {
                        name: MessageName.GetLoginInformationCallback,
                        body: {
                            result: {
                                shopId: '99997',
                                shopName: '99997 - KUN POS Projekt',
                                registerId: '314eb6bb-a790-498b-b7b2-6239f4d44653',
                                registerName: 'Kasse - ALT - Alan Roberts',
                                userId: 'ABMB',
                                userName: 'Abbas Mahmoud Badreddine (ABMB)'
                            },
                            error: null
                        },
                        callbackId: message.callbackId
                    };
                    break;
                case MessageName.OpenURL:
                    window.open(message.body.url);
                    callbackMessage = {
                        name: MessageName.OpenURLCallback,
                        body: {result: true, error: null},
                        callbackId: message.callbackId
                    };
                    break;
                case MessageName.PrintDocumentAtURL:
                case MessageName.PrintDocumentWithData:
                    if (document.getElementById('wallmob_iframe')) {
                        document.body.removeChild(document.getElementById('wallmob_iframe'));
                    }

                    var iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.id = 'wallmob_iframe';

                    document.body.appendChild(iframe);
                    document.getElementById('wallmob_iframe').onload = function () {
                        iframe.contentWindow.print();

                    };
                    if (message.body.data) {
                        var blob = b64toBlob(message.body.data, 'application/pdf');
                        iframe.src = URL.createObjectURL(blob);

                    } else {
                        iframe.src = message.body.url
                    }

                    callbackMessage = {
                        name: MessageName.PrintDocumentCallback,
                        body: {result: true, error: null},
                        callbackId: message.callbackId
                    };

                    break;
                case MessageName.SendPOSConnectorObjectPathToPOS:
                    POSSimulate.pos =  message.body.ObjectPath;
                    callbackMessage = {
                        name: MessageName.SendPOSConnectorObjectPathToPOSCallback,
                        body: {result: true, error: null},
                        callbackId: message.callbackId
                    };
                    break;
                default:
                    console.warn(message);
                    return;
            }
            window[POSSimulate.pos].receiveMessage(callbackMessage);

        },
        subscribes: function () {
            setInterval(function () {
                window[POSSimulate.pos].receiveMessage({
                    name: MessageName.BarcodeScanned,
                    body: {barcode: (Math.random() * 10000000000000).toFixed()}

                });
            }, 5000);
        },
        init: function () {


            window.webkit = {};
            window.webkit.messageHandlers = {};
            window.webkit.messageHandlers.POS = POSSimulate;

             // POSSimulate.subscribes();
        },

        sendBarcode: function(number) {
	        window[POSSimulate.pos].receiveMessage({
		        name: MessageName.BarcodeScanned,
		        body: {barcode: number}

	        });
        }
    };

    POSSimulate.init();


}());
