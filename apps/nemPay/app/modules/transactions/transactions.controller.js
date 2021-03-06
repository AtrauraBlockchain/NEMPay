class TransactionsCtrl {
    constructor(Wallet, Alert, $location, DataBridge, $scope, $filter, Transactions, NetworkRequests, Alias) {
        'ngInject';

        // Alert service
        this._Alert = Alert;
        // Filters
        this._$filter = $filter;
        // $location to redirect
        this._location = $location;
        // Wallet service
        this._Wallet = Wallet;
        // Transaction service
        this._Transactions = Transactions;
        // DataBridge service
        this._DataBridge = DataBridge;
        this._NetworkRequests = NetworkRequests;
        this._Alias = Alias;


        // If no wallet show alert and redirect to home
        if (!this._Wallet.current) {
            this._Alert.noWalletLoaded();
            this._location.path('/');
        }

        /**
         * Default Dashboard properties
         */

        // Harvesting chart data
        this.labels = [];
        this.valuesInFee = [];
        // Helper to know if no data for chart
        this.chartEmpty = true;

        // Default tab on confirmed transactions
        this.transactionTab = 0;


        /**
         * Watch harvested blocks in Databridge service for the chart
         */
        $scope.$watch(() => this._DataBridge.harvestedBlocks, (val) => {
            this.labels = [];
            this.valuesInFee = [];
            if (!val) {
                return;
            }
            for (let i = 0; i < val.length; ++i) {
                // If fee > 0 we push the block as label and the fee as data for the chart
                if (val[i].totalFee / 1000000 > 0) {
                    this.labels.push(val[i].height)
                    this.valuesInFee.push(val[i].totalFee / 1000000);
                }
            }
            // If nothing above 0 XEM show message
            if (!this.valuesInFee.length) {
                this.chartEmpty = true;
            } else {
                this.chartEmpty = false;
            }
        });
    }

    /**
     * refreshMarketInfo() Fetch data from CoinMarketCap api to refresh market information
     */
    refreshMarketInfo() {
        // Get market info
        this._NetworkRequests.getMarketInfo().then((data) => {
                this._DataBridge.marketInfo = data;
            },
            (err) => {
                // Alert error
                this._Alert.errorGetMarketInfo();
            });
        // Gets btc price
        this._NetworkRequests.getBtcPrice().then((data) => {
                this._DataBridge.btcPrice = data;
            },
            (err) => {
                this._Alert.errorGetBtcPrice();
            });
    }

    /**
     * Fix a value to 4 decimals
     */
    toFixed4(value) {
        return value.toFixed(4);
    }

    changeTransactionsTab(value) {
        this.transactionTab = value;
    }
}

export default TransactionsCtrl;