const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
                                    
const CONNECTION_PROFILE_PATH = './gateway/profiles/dev-connection.yaml';
const FILESYSTEM_WALLET_PATH = './gateway/user-wallet';

const USER_ID = 'Admin@acme.com';
const NETWORK_NAME = 'airlinechannel';
const CONTRACT_ID = 'fabcar3';
const gateway = new Gateway();

 async function setupGateway() {
    try {
        await connect();

        let network = await gateway.getNetwork(NETWORK_NAME);

        const contract = await network.getContract(CONTRACT_ID);

        return contract;
    } catch (error) {       
        console.log("error :" + error)
    }
}

async function disconnect() {
    try {

        await gateway.disconnect();

    } catch (error) {        
        console.log("error :" + error)
    }
}


async function connect() {
    try {
       
        let connectionProfile = yaml.safeLoad(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));


        const wallet = await Wallets.newFileSystemWallet(FILESYSTEM_WALLET_PATH);
        let connectionOptions = {
            wallet,
            identity: USER_ID,
            discovery: { enabled: true, asLocalhost: true }
            /*** Uncomment lines below to disable commit listener on submit ****/
            , eventHandlerOptions: {
                strategy: null
            }
        }
        await gateway.connect(connectionProfile, connectionOptions);

    } catch (error) {
        console.log("Failed to connect: " + error);
        process.exit(1);
    }
}

module.exports = {
    setupGateway: setupGateway,
    disconnect: disconnect
};