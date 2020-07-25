const express = require('express');
const gateway = require('../gateway/gateway')



const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();
        const response = await getAllCars(contract, req.query.bookmark);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});

router.get('/search', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();
        //console.log(req.body.owner);
        const response = await getCarsByOwner(contract, req.query.bookmark, req.query.owner);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});
router.get('/:carNo', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();
        const response = await getCar(contract, req.params.carNo);
       
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});

router.post('/new', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();
        var car = { Number: req.body.CarNumber, Make: req.body.Make, Model: req.body.Model, Colour: req.body.Colour, Owner: req.body.Owner };
        const response = await addNewCar(contract, car);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});

router.post('/:carNo', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();

        const response = await updateCarOwner(contract, req.params.carNo, req.body.Owner);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});

router.delete('/:carNo', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();
        const response = await deleteCar(contract, req.params.carNo);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});

router.get('/:carNo/priv', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();        
        const response = await getPrivData(contract, req.params.carNo);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});

router.post('/:carNo/priv', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();
        const response = await createPrivData(contract, req.body.Collection, req.params.carNo, req.body.Notes, req.body.Price);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});

router.get('/:carNo/his', async (req, res) => {
    try {
        const contract = await gateway.setupGateway();
        const response = await getCarHistory(contract, req.params.carNo);
        res.json(response);
        await gateway.disconnect();
    }
    catch (error) {
        res.json({ message: error });
    }
});



async function getAllCars(contract,bookmark) {
    try {
        let response = await contract.evaluateTransaction('queryAllCars',bookmark);
        return response.toString();
    }
    catch (err) {
        throw err;
    }
}

async function getCarsByOwner(contract, bookmark,owner) {
    try {
        let response = await contract.evaluateTransaction('getCarsByOwner', bookmark,owner);
        return response.toString();
    }
    catch (err) {
        throw err;
    }
}

async function getCar(contract, carNo) {
    try {
        let response = await contract.evaluateTransaction('queryCar', carNo);
        return response.toString();
    }
    catch (err) {
        throw err;
    }
}

async function addNewCar(contract, car) {
    try {
        let response = await contract.submitTransaction('createNewCar', car.Number, car.Make, car.Model, car.Colour, car.Owner);
        console.log(response.toString());
    }
    catch (err) {
        throw err;
    }
}

async function updateCarOwner(contract, carNo, owner) {
    try {
        let response = await contract.submitTransaction('changeCarOwner', carNo, owner);
        console.log(response.toString());
    }
    catch (err) {
        throw err;
    }
}

async function deleteCar(contract, carNo) {
    try {
        let response = await contract.submitTransaction('deleteCar', carNo);
        console.log(response.toString());
    }
    catch (err) {
        throw err;
    }
}

async function createPrivData(contract, collection, carNo, notes, price) {
    try {
        let response = await contract.submitTransaction('createPrivateData', collection, carNo, notes, price);
        console.log(response.toString());
    }
    catch (err) {
        throw err;
    }
}

async function getPrivData(contract, carNo) {
    try {
        let response = await contract.evaluateTransaction('getPrivateData', carNo);
        return response.toString();
    }
    catch (err) {
        throw err;
    }
}

async function getCarHistory(contract, carNo) {
    try {
        let response = await contract.evaluateTransaction('getCarHistory', carNo);
        return response.toString();
    }
    catch (err) {
        throw err;
    }
}

module.exports = router;