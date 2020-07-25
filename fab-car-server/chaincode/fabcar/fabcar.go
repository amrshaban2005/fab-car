package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	peer "github.com/hyperledger/fabric-protos-go/peer"

	"github.com/hyperledger/fabric-protos-go/ledger/queryresult"
)

// FabCar Chaincode
type FabCar struct {
}

// Car Object
type Car struct {
	Make   string `json:"make"`
	Model  string `json:"model"`
	Colour string `json:"colour"`
	Owner  string `json:"owner"`
}

type carPrivateDetails struct {
	Notes string `json:"notes"`
	Price uint64 `json:"price"`
}

// type QueryResult struct {
// 	Key    string `json:"key"`
// 	Record *Car
// }

// Init Function
func (contract *FabCar) Init(stub shim.ChaincodeStubInterface) peer.Response {

	cars := []Car{
		Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
		Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
		Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
		Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
		Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
		Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
		Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
		Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
		Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
		Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
	}

	for i, car := range cars {
		carAsByte, _ := json.Marshal(car)
		err := stub.PutState("CAR"+strconv.Itoa(i), carAsByte)
		if err != nil {
			return shim.Error("Failed to put to world state " + err.Error())
		}
	}

	return shim.Success([]byte("true"))
}

// Invoke Function
func (contract *FabCar) Invoke(stub shim.ChaincodeStubInterface) peer.Response {

	funcName, args := stub.GetFunctionAndParameters()

	if funcName == "queryAllCars" {
		return contract.queryAllCars(stub, args)
	} else if funcName == "createNewCar" {
		return contract.createNewCar(stub, args)
	} else if funcName == "queryCar" {
		return contract.queryCar(stub, args)
	} else if funcName == "changeCarOwner" {
		return contract.changeCarOwner(stub, args)
	} else if funcName == "deleteCar" {
		return contract.deleteCar(stub, args)
	} else if funcName == "createPrivateData" {
		return contract.createPrivateData(stub, args)
	} else if funcName == "getPrivateData" {
		return contract.getPrivateData(stub, args)
	} else if funcName == "getCarHistory" {
		return contract.getCarHistory(stub, args)
	} else if funcName == "getCarsByOwner" {
		return contract.getCarsByOwner(stub, args)
	}

	return shim.Error("Invalid Function Name!!")
}

func (contract *FabCar) queryCar(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Invalid function Key")
	}

	data, err := stub.GetState(args[0])

	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(data)

}

// queryAllCars to get all cars
// func (contract *FabCar) queryAllCars(stub shim.ChaincodeStubInterface) peer.Response {

// 	queryIterator, err := stub.GetStateByRange("", "")

// 	if err != nil {
// 		return shim.Error(err.Error())
// 	}
// 	var counter = 0
// 	var resultJSON = "["

// 	for queryIterator.HasNext() {

// 		var record *queryresult.KV
// 		record, err = queryIterator.Next()

// 		if err != nil {
// 			return shim.Error(err.Error())
// 		}
// 		var data string
// 		data = "{\"Key\":\"" + record.GetKey() + "\",\"Record\":" + string(record.GetValue()) + "}"
// 		//data = string(record.GetValue())

// 		if counter > 0 {
// 			resultJSON += ","
// 		}
// 		resultJSON += data
// 		counter++

// 	}

// 	resultJSON += "]"
// 	queryIterator.Close()

// 	return shim.Success([]byte(resultJSON))
// }

func (contract *FabCar) queryAllCars(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Invalid function Key")
	}
	//pageSize, _ := strconv.ParseInt(string(args[1]), 10, 32)
	pageSize := 10
	bookmark := args[0]

	var qryIterator shim.StateQueryIteratorInterface
	var qryMeteData *peer.QueryResponseMetadata
	var err error

	qryIterator, qryMeteData, err = stub.GetStateByRangeWithPagination("", "", int32(pageSize), bookmark)
	if err != nil {
		return shim.Error(err.Error())
	}
	var counter = 0
	var resultJSON = "["

	for qryIterator.HasNext() {

		var record *queryresult.KV
		record, err = qryIterator.Next()

		if err != nil {
			return shim.Error(err.Error())
		}
		var data string

		bookmark = qryMeteData.Bookmark
		data = "{\"bookmark\":\"" + bookmark + "\",\"Key\":\"" + record.GetKey() + "\",\"Record\":" + string(record.GetValue()) + "}"

		if counter > 0 {
			resultJSON += ","
		}
		resultJSON += data
		counter++

	}

	resultJSON += "]"
	qryIterator.Close()

	return shim.Success([]byte(resultJSON))
}

func (contract *FabCar) getCarsByOwner(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 2 {
		return shim.Error("Invalid function Key")
	}
	//pageSize, _ := strconv.ParseInt(string(args[1]), 10, 32)
	pageSize := 10
	bookmark := args[0]
	query := `{
   "selector": {
	  "owner":`
	query += "\"" + args[1] + "\""
	query += `},
   "sort": [
      {
         "colour": "asc"
      }
   ]
}`

	var qryIterator shim.StateQueryIteratorInterface
	var qryMeteData *peer.QueryResponseMetadata
	var err error

	qryIterator, qryMeteData, err = stub.GetQueryResultWithPagination(query, int32(pageSize), bookmark)
	if err != nil {
		return shim.Error(err.Error())
	}
	var counter = 0
	var resultJSON = "["

	for qryIterator.HasNext() {

		var record *queryresult.KV
		record, err = qryIterator.Next()

		if err != nil {
			return shim.Error(err.Error())
		}
		var data string

		bookmark = qryMeteData.Bookmark
		data = "{\"bookmark\":\"" + bookmark + "\",\"Key\":\"" + record.GetKey() + "\",\"Record\":" + string(record.GetValue()) + "}"

		if counter > 0 {
			resultJSON += ","
		}
		resultJSON += data
		counter++

	}

	resultJSON += "]"
	qryIterator.Close()

	return shim.Success([]byte(resultJSON))
}

func (contract *FabCar) getCarHistory(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Invalid function Key")
	}
	queryIterator, err := stub.GetHistoryForKey(args[0])

	if err != nil {
		return shim.Error(err.Error())
	}
	var counter = 0
	var resultJSON = "["

	for queryIterator.HasNext() {

		var record *queryresult.KeyModification
		record, err = queryIterator.Next()

		if err != nil {
			return shim.Error(err.Error())
		}
		var data string
		data = "{\"Key\":\"" + record.GetTxId() + "\",\"Record\":" + string(record.GetValue()) + "}"
		//data = string(record.GetValue())

		if counter > 0 {
			resultJSON += ","
		}
		resultJSON += data
		counter++

	}

	resultJSON += "]"
	queryIterator.Close()

	return shim.Success([]byte(resultJSON))
}

// createNewCar to add new car
func (contract *FabCar) createNewCar(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 5 {
		return shim.Error("Invalid Parameter count")
	}
	car := Car{Make: args[1], Model: args[2], Colour: args[3], Owner: args[4]}
	carByte, _ := json.Marshal(car)
	err := stub.PutState(args[0], carByte)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(carByte)
}

func (contract *FabCar) createPrivateData(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 4 {
		return shim.Error("Invalid Parameter count")
	}
	price, _ := strconv.ParseUint(args[3], 10, 64)
	carprvDetails := carPrivateDetails{Notes: args[2], Price: price}
	carByte, _ := json.Marshal(carprvDetails)
	err := stub.PutPrivateData(args[0], args[1], carByte)
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success(carByte)
}

func (contract *FabCar) getPrivateData(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Invalid function Key")
	}

	//dataOpen, _ := stub.GetPrivateData("AcmeBudgetOpen", args[0])
	dataClose, _ := stub.GetPrivateData("AcmePrivate", args[0])
	// secretError := "Na"
	// if err != nil {
	// 	secretError = err.Error()
	// }
	//resultString := "{}"
	//resultString = "{open:\"" + string(dataOpen) + "\",secret:\"" + string(dataClose) + "\",secretError:\"" + string(secretError) + "\"}"
	//resultString = "{open:\"" + string(dataOpen) + "\",secret:\"" + string(dataClose) + "\",secretError:\"" + string(secretError) + "\"}"
	return shim.Success(dataClose)

}

func (contract *FabCar) changeCarOwner(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("Invalid function parmaeters")
	}

	data, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	car := Car{}
	_ = json.Unmarshal(data, &car)
	car.Owner = args[1]
	carByte, _ := json.Marshal(car)
	stub.PutState(args[0], carByte)

	return shim.Success(carByte)

}

func (contract *FabCar) deleteCar(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Invalid function parameters")
	}

	err := stub.DelState(args[0])
	if err != nil {
		return shim.Error(err.Error())
	}
	return shim.Success([]byte("true"))
}

func main() {

	err := shim.Start(new(FabCar))
	if err != nil {
		fmt.Printf("Error while start chaincode: %s", err)
	}
}
