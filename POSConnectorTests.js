var POSConnectorTests = (function () {

    "use_strict";

    var tests = {};

    if (POSConnector === undefined) {
        console.log("POSConnector is required for the example to run");
        return;
    }

    tests.TestPayBasket = function () {
        var lineItem1 = new POSConnector.LineItem("Apple Lightning Cable", 2, 99.95, 0.25, 0);
        var lineItem2Discount = new POSConnector.Discount(499.5, "VIP Discount", 0.1);
        var lineItem2 = new POSConnector.LineItem("Apple iPad Pro", 1, 4995, 0.25, 0, null, null, [lineItem2Discount]);
        var discount = new POSConnector.Discount(100, "Member Campaign Discount");
        var transaction = new POSConnector.Transaction(POSConnector.TransactionType.Installment, 4000);
        var dummyId = Math.random().toString();
        var basket = new POSConnector.Basket(dummyId, [lineItem1, lineItem2], [transaction], [discount]);
        POSConnector.payBasket(basket, function (success, error) {
            console.log("PayBasketCallback: " + success);
            console.log("ID: " + dummyId);
            if (error) {
                console.log("Error: " + error);
            }
        });
    };

    tests.TestGetLoginInformation = function () {
        POSConnector.getLoginInformation(function (loginInformation, error) {
            console.log("GetLoginInformationCallback");
            if (loginInformation) {
                console.log("Shop id: " + loginInformation.shopId);
                console.log("Shop name: " + loginInformation.shopName);
                console.log("Register id: " + loginInformation.registerId);
                console.log("Register name: " + loginInformation.registerName);
                console.log("User id: " + loginInformation.userId);
                console.log("User name: " + loginInformation.userName);
            }
            if (error) {
                console.log("Error: " + error);
            }
        });
    };

    POSConnector.addEventListener(POSConnector.EventType.BarcodeScanned, function (barcode) {
        console.log("Barcode scanned: " + barcode);
    });

    POSConnector.addEventListener(POSConnector.EventType.ConnectionEstablished, function () {
        console.log("Connection established");
    });

    return tests;

}());
