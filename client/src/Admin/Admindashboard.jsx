import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admindashboard.css';

const Admindashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [assets, setAssets] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [assetName, setAssetName] = useState('');
    const [assetType, setAssetType] = useState('');
    const [assetBrand, setAssetBrand] = useState('');
    const [assetModel, setAssetModel] = useState('');
    const [assetSerialNumber, setAssetSerialNumber] = useState('');
    const [assetValue, setAssetValue] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [activeSection, setActiveSection] = useState('home');
    const [isEditMode, setIsEditMode] = useState(false); // Edit mode for employees
    const [showAddAssetForm, setShowAddAssetForm] = useState(false); // Show add asset form
    const [showGeneralAddAssetForm, setShowGeneralAddAssetForm] = useState(false); // For sidebar Add Asset button

    axios.defaults.baseURL = 'http://localhost:5001';

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('/api/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees", error);
            alert("Failed to fetch employees. Please check the server.");
        }
    };

    const fetchAssets = async (employeeId) => {
        try {
            const response = await axios.get(`/api/assets?employeeId=${employeeId}`);
            setAssets(response.data);
        } catch (error) {
            console.error("Error fetching assets", error);
            alert("Failed to fetch assets. Please check the server.");
        }
    };

    const fetchAllAssets = async () => {
        try {
            const response = await axios.get('/api/assets');
            setAssets(response.data);
        } catch (error) {
            console.error("Error fetching all assets", error);
            alert("Failed to fetch all assets. Please check the server.");
        }
    };

    const handleAddEmployee = async () => {
        try {
            await axios.post('/api/employees', { name, email, role });
            fetchEmployees();
            resetEmployeeForm();
            alert("Employee added successfully!");
        } catch (error) {
            console.error("Error adding employee", error);
            alert(`Failed to add employee: ${error.response?.data?.message}`);
        }
    };

    const handleEditEmployee = async () => {
        if (selectedEmployee) {
            try {
                await axios.put(`/api/employees/${selectedEmployee._id}`, { name, email, role });
                fetchEmployees();
                resetEmployeeForm();
                setSelectedEmployee(null);
                setIsEditMode(false); // Disable edit mode after saving
                alert("Employee updated successfully!");
            } catch (error) {
                console.error("Error updating employee:", error);
                alert(`Failed to update employee: ${error.response?.data?.message}`);
            }
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`/api/employees/${id}`);
            fetchEmployees();
            alert("Employee deleted successfully!");
        } catch (error) {
            console.error("Error deleting employee", error);
            alert("Failed to delete employee. Please try again.");
        }
    };

    const handleAddAsset = async () => {
        if (selectedEmployee) {
            try {
                await axios.post('/api/assets', {
                    employeeId: selectedEmployee._id,
                    name: assetName,
                    type: assetType,
                    brand: assetBrand,
                    model: assetModel,
                    serialNumber: assetSerialNumber,
                    value: assetValue,
                });
                fetchAssets(selectedEmployee._id);
                resetAssetForm();
                setShowAddAssetForm(false); // Hide add asset form after submission
                alert("Asset added successfully!");
            } catch (error) {
                console.error("Error adding asset", error);
                alert(`Failed to add asset: ${error.response?.data?.message}`);
            }
        } else {
            alert("Please select an employee first.");
        }
    };

    const handleAddGeneralAsset = async () => {
        try {
            await axios.post('/api/assets', {
                name: assetName,
                type: assetType,
                brand: assetBrand,
                model: assetModel,
                serialNumber: assetSerialNumber,
                value: assetValue,
            });
            fetchAllAssets(); // Fetch all assets after adding
            resetAssetForm();
            setShowGeneralAddAssetForm(false); // Hide the general asset form
            alert("Asset added successfully!");
        } catch (error) {
            console.error("Error adding asset", error);
            alert(`Failed to add asset: ${error.response?.data?.message}`);
        }
    };

    const handleDeleteAsset = async (id) => {
        try {
            await axios.delete(`/api/assets/${id}`);
            fetchAssets(selectedEmployee._id);
            alert("Asset deleted successfully!");
        } catch (error) {
            console.error("Error deleting asset", error);
            alert("Failed to delete asset. Please try again.");
        }
    };

    const resetEmployeeForm = () => {
        setName('');
        setEmail('');
        setRole('');
        setSelectedEmployee(null);
        setIsEditMode(false); // Disable edit mode
    };

    const resetAssetForm = () => {
        setAssetName('');
        setAssetType('');
        setAssetBrand('');
        setAssetModel('');
        setAssetSerialNumber('');
        setAssetValue('');
    };

    const startEditEmployee = (employee) => {
        setName(employee.name);
        setEmail(employee.email);
        setRole(employee.role);
        setSelectedEmployee(employee);
        setIsEditMode(true); // Enable edit mode
        fetchAssets(employee._id); // Fetch assets for selected employee
    };

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h2>Asset Management</h2>
                <button onClick={() => setActiveSection('home')}>Home</button>
                <button onClick={() => { fetchEmployees(); setActiveSection('employees'); }}>Employees</button>
                <button onClick={() => { resetEmployeeForm(); setActiveSection('add-employee'); }}>Add Employee</button>
                <button onClick={() => { fetchAllAssets(); setActiveSection('assets'); }}>Assets</button>
                <button onClick={() => { setActiveSection('add-asset'); setShowGeneralAddAssetForm(true); }}>Add Asset</button>
            </div>
            <div className="content">
                {activeSection === 'home' && <h1>Welcome to Asset Management</h1>}
                {activeSection === 'employees' && (
                    <>
                        <h2>Employees</h2>
                        <ul>
                            {employees.map((employee) => (
                                <li key={employee._id} onClick={() => startEditEmployee(employee)}>
                                    {employee.name} - {employee.email} - {employee.role}
                                    <button onClick={() => handleDeleteEmployee(employee._id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {activeSection === 'add-employee' && (
                    <div>
                        <h2>{isEditMode ? "Edit Employee" : "Add Employee"}</h2> {/* Show "Edit" or "Add" */}
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <button onClick={isEditMode ? handleEditEmployee : handleAddEmployee}>
                            {isEditMode ? "Update Employee" : "Add Employee"}
                        </button>
                        <button onClick={resetEmployeeForm}>Cancel</button>
                    </div>
                )}
                {selectedEmployee && (
                    <div className="employee-card">
                        <h2>Employee Details</h2>
                        <div className="employee-info">
                            <div className="card">
                                <h3>{selectedEmployee.name}</h3>
                                <p>Email: {selectedEmployee.email}</p>
                                <p>Role: {selectedEmployee.role}</p>
                                <div className="employee-actions">
                                    <button onClick={() => setActiveSection('add-employee')}>Edit Employee</button> {/* Edit button to switch to edit mode */}
                                    <button onClick={() => handleDeleteEmployee(selectedEmployee._id)}>Delete Employee</button>
                                </div>
                            </div>
                        </div>
                        <h3>Assets</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Serial Number</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.length > 0 ? (
                                    assets.map((asset) => (
                                        <tr key={asset._id}>
                                            <td>{asset.name}</td>
                                            <td>{asset.type}</td>
                                            <td>{asset.brand}</td>
                                            <td>{asset.model}</td>
                                            <td>{asset.serialNumber}</td>
                                            <td>{asset.value}</td>
                                            <td>
                                                <button onClick={() => handleDeleteAsset(asset._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No assets found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <button onClick={() => setShowAddAssetForm(true)}>Add Asset</button>
                        {showAddAssetForm && (
                            <div>
                                <h3>Add New Asset</h3>
                                <input
                                    type="text"
                                    placeholder="Asset Name"
                                    value={assetName}
                                    onChange={(e) => setAssetName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Asset Type"
                                    value={assetType}
                                    onChange={(e) => setAssetType(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Brand"
                                    value={assetBrand}
                                    onChange={(e) => setAssetBrand(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Model"
                                    value={assetModel}
                                    onChange={(e) => setAssetModel(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Serial Number"
                                    value={assetSerialNumber}
                                    onChange={(e) => setAssetSerialNumber(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={assetValue}
                                    onChange={(e) => setAssetValue(e.target.value)}
                                />
                                <button onClick={handleAddAsset}>Add Asset</button>
                                <button onClick={() => setShowAddAssetForm(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                )}
                {activeSection === 'assets' && (
                    <div>
                        <h2>All Assets</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Serial Number</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.length > 0 ? (
                                    assets.map((asset) => (
                                        <tr key={asset._id}>
                                            <td>{asset.name}</td>
                                            <td>{asset.type}</td>
                                            <td>{asset.brand}</td>
                                            <td>{asset.model}</td>
                                            <td>{asset.serialNumber}</td>
                                            <td>{asset.value}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">No assets found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeSection === 'add-asset' && showGeneralAddAssetForm && (
                    <div>
                        <h2>Add Asset</h2>
                        <input
                            type="text"
                            placeholder="Asset Name"
                            value={assetName}
                            onChange={(e) => setAssetName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Asset Type"
                            value={assetType}
                            onChange={(e) => setAssetType(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Brand"
                            value={assetBrand}
                            onChange={(e) => setAssetBrand(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Model"
                            value={assetModel}
                            onChange={(e) => setAssetModel(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Serial Number"
                            value={assetSerialNumber}
                            onChange={(e) => setAssetSerialNumber(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Value"
                            value={assetValue}
                            onChange={(e) => setAssetValue(e.target.value)}
                        />
                        <button onClick={handleAddGeneralAsset}>Add Asset</button>
                        <button onClick={() => setShowGeneralAddAssetForm(false)}>Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admindashboard;
