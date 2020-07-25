# fab-car
- this project has implemented fabcar chaincode example of hyperledger fabric 
- the project is depeding on hyperledger fabric network which contains tow orgs acme org(one orderer and one peer) and budget org(peer)
- the project has two parts fab-car-server and fab-car-client
# fab-car-server
- contains the chaincode of fabcar written in golang (folder chaincode/fabcar)
- contains node js project using fabric-sdk-node which used to connect to fabcar chaincode which deployed in fabric network (folder gateway) 
- contains rest api to access the the fabric api client from the web app

# fab-car-client
- web app
- angular project
- connect to the fab-car-server rest api
# How to run
- install the fabcar chaincode in the fabric network
- make required changes to profiles and gateway to connect to your network
- run npm start on fab-car-server
- run ng serve on fab-car-client