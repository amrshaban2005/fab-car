const fs = require('fs');
const path = require('path');
const { Wallets, X509Identity } = require('fabric-network');

const CRYPTO_CONFIG = path.resolve(__dirname, '../../../first-network/multi-org/crypto-config');
const CRYPTO_CONFIG_PEER_ORG = path.join(CRYPTO_CONFIG, 'peerOrganizations');

const WALLET_FOLDER = './user-wallet';



let action = process.argv[2];
if (action == 'list') {
    console.log('list idenetities on wallet');
    listIdenetities();
} else if (action == 'add') {
    addToWallet(process.argv[3], process.argv[4]);
    console.log("add identity done");
} else if (action == 'export') {
    exportIdenetity(process.argv[3], process.argv[4]);
}

async function addToWallet(org, user) {
    try {

        var cert = readCertCryptogen(org, user);
        var key = readPrivateKeyCryptogen(org, user);
    } catch (e) {

        console.log("Error reading cert and key for org or key " + org + "/" + user);
        process.exit(1);
    }
    const wallet = await Wallets.newFileSystemWallet(WALLET_FOLDER);
    let mspId = createMSPId(org);
    const identityLabel = createIdentityLabel(org, user);


    const X509Identity = {
        credentials: {
            certificate: cert,
            privateKey: key,
        },
        mspId: mspId,
        type: 'X.509',
    };
   
    await wallet.put(identityLabel, X509Identity);
}

async function exportIdenetity(org, user) {
    const identityLabel = createIdentityLabel(org, user);
    const wallet = await Wallets.newFileSystemWallet(WALLET_FOLDER);
    let idenetity = await wallet.get(identityLabel);
    if (idenetity == null) {
        console.log("Not found");
    } else {
        console.log(idenetity);
    }
    let provider = await wallet.getProviderRegistry();
    console.log(provider);

}

async function listIdenetities() {
    const wallet = await Wallets.newFileSystemWallet(WALLET_FOLDER);
    let list = await wallet.list();
    console.log(list)
}

function readCertCryptogen(org, user) {
    //budget.com/users/Admin@budget.com/msp/signcerts/Admin@budget.com-cert.pem"
    var certPath = CRYPTO_CONFIG_PEER_ORG + "/" + org + ".com/users/" + user + "@" + org + ".com/msp/signcerts/" + user + "@" + org + ".com-cert.pem";
    const cert = fs.readFileSync(certPath).toString();
    return cert;
}

function readPrivateKeyCryptogen(org, user) {
    // ../crypto/crypto-config/peerOrganizations/budget.com/users/Admin@budget.com/msp/keystore/05beac9849f610ad5cc8997e5f45343ca918de78398988def3f288b60d8ee27c_sk
    var pkFolder = CRYPTO_CONFIG_PEER_ORG + "/" + org + ".com/users/" + user + "@" + org + ".com/msp/keystore"

    fs.readdirSync(pkFolder).forEach(file => {
        pkfile = file
        return
    })
    return fs.readFileSync(pkFolder + '/' + pkfile).toString();

}

function createMSPId(org) {
    return org.charAt(0).toUpperCase() + org.slice(1) + 'MSP';
}

function createIdentityLabel(org, user) {
    return user + '@' + org + '.com';
}