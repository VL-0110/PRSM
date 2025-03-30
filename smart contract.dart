// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHRBlockchain {
    struct Patient {
        string name;
        uint age;
        string gender;
        address patientAddress;
        string[] records;
    }
    
    struct Doctor {
        string name;
        string specialization;
        address doctorAddress;
    }
    
    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => bool) public authorizedDoctors;
    
    event RecordAdded(address indexed patient, string recordHash);
    
    modifier onlyPatient() {
        require(bytes(patients[msg.sender].name).length > 0, "Not a registered patient");
        _;
    }
    
    modifier onlyDoctor() {
        require(bytes(doctors[msg.sender].name).length > 0, "Not a registered doctor");
        _;
    }
    
    function registerPatient(string memory _name, uint _age, string memory _gender) public {
        patients[msg.sender] = Patient(_name, _age, _gender, msg.sender, new string[](0));
    }
    
    function registerDoctor(string memory _name, string memory _specialization) public {
        doctors[msg.sender] = Doctor(_name, _specialization, msg.sender);
    }
    
    function authorizeDoctor(address _doctor) public onlyPatient {
        authorizedDoctors[_doctor] = true;
    }
    
    function addRecord(string memory _recordHash) public onlyPatient {
        patients[msg.sender].records.push(_recordHash);
        emit RecordAdded(msg.sender, _recordHash);
    }
    
    function getRecords(address _patient) public view onlyDoctor returns (string[] memory) {
        require(authorizedDoctors[msg.sender], "Doctor not authorized");
        return patients[_patient].records;
    }
}
