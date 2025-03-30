import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Input, Card, CardContent } from "@/components/ui";

const contractAddress = "YOUR_SMART_CONTRACT_ADDRESS";
const contractABI = [ /* Add your smart contract ABI here */ ];

export default function EHRApp() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [userType, setUserType] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [records, setRecords] = useState([]);
  
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });
    }
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
      setAccount(await signer.getAddress());
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function registerPatient() {
    if (contract) {
      await contract.registerPatient(name, age, gender);
    }
  }

  async function registerDoctor() {
    if (contract) {
      await contract.registerDoctor(name, specialization);
    }
  }

  async function getPatientRecords() {
    if (contract && patientAddress) {
      try {
        const recordsData = await contract.getRecords(patientAddress);
        setRecords(recordsData);
      } catch (error) {
        alert("You are not authorized to view these records.");
      }
    }
  }

  return (
    <div className="p-4">
      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <Card>
          <CardContent>
            <p>Connected: {account}</p>
            <Button onClick={() => setUserType("patient")} className="mr-2">Register as Patient</Button>
            <Button onClick={() => setUserType("doctor")} className="mr-2">Register as Doctor</Button>
          </CardContent>
        </Card>
      )}
      {userType === "patient" && (
        <Card className="mt-4">
          <CardContent>
            <h3>Patient Registration</h3>
            <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Age" type="number" onChange={(e) => setAge(e.target.value)} />
            <Input placeholder="Gender" onChange={(e) => setGender(e.target.value)} />
            <Button onClick={registerPatient}>Register</Button>
          </CardContent>
        </Card>
      )}
      {userType === "doctor" && (
        <Card className="mt-4">
          <CardContent>
            <h3>Doctor Registration</h3>
            <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Specialization" onChange={(e) => setSpecialization(e.target.value)} />
            <Button onClick={registerDoctor}>Register</Button>
          </CardContent>
        </Card>
      )}
      {userType === "doctor" && (
        <Card className="mt-4">
          <CardContent>
            <h3>View Patient Records</h3>
            <Input placeholder="Patient Address" onChange={(e) => setPatientAddress(e.target.value)} />
            <Button onClick={getPatientRecords}>Get Records</Button>
            <ul>
              {records.map((record, index) => (
                <li key={index}>{record}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
