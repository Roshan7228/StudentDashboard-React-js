import React, { useEffect, useState } from "react";
import "../assets/Dashboard.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

function Dashboard() {
	const navigate = useNavigate();

	// Modal addStudent state
	const [Modal, SetModal] = useState(false);


	// Student page click after show
	const [Show,SetShow]=useState(false);

	// State for viewing student details
	const [ViewModal, setViewModal] = useState(false);
	

	// Google Logout Function
	const LogOutGoogleEmail = () => {
		signOut(auth)
			.then(() => {
				console.log("User logged out successfully");
				navigate("/Login");
			})
			.catch((error) => {
				console.error("Error during logout:", error);
			});
	};

	// Add/Update student data
	let AddStudetndata = {
		FirstName: "",
		MiddleName: "",
		LastName: "",
		Class: "",
		Section: "",
		Gender: "",
		RollNumber: "",
		EmailID: "",
		PhoneNumber: "",
		Address: "",
		GuardianName: "",
		GuardianContact: "",
		Attendance: "",
	};

	const [assing, setassing] = useState(AddStudetndata);

	// Submit Data (Add or Update)
	function handlesubmite(e) {
		e.preventDefault();

		if (assing.id) {
			// If ID exists, update the document
			const studentRef = doc(db, "StudentData", assing.id);
			updateDoc(studentRef, assing)
				.then(() => {
					console.log("Student updated successfully");
					refreshData();
					setassing(AddStudetndata);
					SetModal(false); 
				})
				.catch((err) => console.log("Error updating document:", err));
		} else {
			// Add new document
			addDoc(collection(db, "StudentData"), assing)
				.then((response) => {
					console.log("Document added with ID:", response.id);
					refreshData();
					setassing(AddStudetndata);
					SetModal(false); 
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	// Handle Input Change
	const handleChanege = (e) => {
		setassing({ ...assing, [e.target.name]: e.target.value });
	};

	// Get Data from Firestore
	const [details, setdetails] = useState([]);

	const refreshData = () => {
		getDocs(collection(db, "StudentData"))
			.then((response) => {
				const data = response.docs.map((doc) => {
					const docData = doc.data();
					docData.id = doc.id; 
					return docData;
				});
				setdetails(data);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		refreshData();
	}, [details]);

	// Delete Data
	function handledataDelete(docData) {
		const docRef = doc(db, "StudentData", docData);
		deleteDoc(docRef)
			.then(() => {
				console.log("Student deleted successfully");
				refreshData();
			})
			.catch((err) => console.log(err));
	}

	// Edit Data
	function handleUpdate(studentId) {
		const studentToUpdate = details.find((student) => student.id === studentId);
		if (studentToUpdate) {
			SetModal(true); 
			setassing(studentToUpdate); 
		}
	}

	// View Student Details
	function handleView(studentId) {
		const student = details.find((student) => student.id === studentId);
		if (student) {
			setViewModal(true);
			setassing(student);
			
			
		}
	}

	return (
		<div>
			<div className="Dashboard">
				<div className="left-saidbar">
					<div className="Studetn-page">
						<h5 onClick={()=>{SetShow(true)}}>Student Page</h5>
					</div>
					<div className="Studetn-page1">
						<button onClick={LogOutGoogleEmail}>Log Out</button>
					</div>
				</div>
				<div className={`Right-saidbar ${Show?"ShowDATA":""}`}>
					<h1>Dashboard</h1>

					{/* Modal for Add/Edit Student */}
					<div className="add-data-modal">
						<button onClick={() => SetModal(true)}>Add Student</button>
					</div>

					<div className="table-container">
						<table className="students-table">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Class</th>
									<th>Section</th>
									<th>Roll Number</th>
									<th>Gender</th>
									<th>Phone</th>
									<th>Email</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{details.map((Details, index) => (
									<tr key={Details.id}>
										<td>{index + 1}</td>
										<td>{`${Details.FirstName} ${Details.MiddleName} ${Details.LastName}`}</td>
										<td>{Details.Class}</td>
										<td>{Details.Section}</td>
										<td>{Details.RollNumber}</td>
										<td>{Details.Gender}</td>
										<td>{Details.PhoneNumber}</td>
										<td>{Details.EmailID}</td>
										<td>
											<button onClick={() => handleView(Details.id)} style={{ cursor: "pointer", marginRight: "10px" }}>
												View
											</button>
											<i
												className="ri-pencil-line"
												onClick={() => handleUpdate(Details.id)}
												style={{ cursor: "pointer", marginRight: "10px", color: "blue" }}
											></i>
											<i
												className="ri-delete-bin-6-line"
												onClick={() => handledataDelete(Details.id)}
												style={{ cursor: "pointer", color: "red" }}
											></i>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

		
			<div className={`modalOverlay ${ViewModal ? "ShowModalOverlay" : ""}`}>
    {details.map((Data, index) => {
        return (
            <div className="modalData ShowmodalData" key={index}>
                <i className="ri-close-large-line" onClick={() => setViewModal(false)}></i>
                <h2>STUDENT DETAILS</h2>
                <p><strong>Name:</strong> {`${Data.FirstName} ${Data.MiddleName} ${Data.LastName}`}</p>
                <p><strong>Class:</strong> {Data.Class}</p>
                <p><strong>Section:</strong> {Data.Section}</p>
                <p><strong>Roll Number:</strong> {Data.RollNumber}</p>
                <p><strong>Gender:</strong> {Data.Gender}</p>
                <p><strong>Phone:</strong> {Data.PhoneNumber}</p>
                <p><strong>Email:</strong> {Data.EmailID}</p>
                <p><strong>Address:</strong> {Data.Address}</p>
                <p><strong>Guardian Name:</strong> {Data.GuardianName}</p>
                <p><strong>Guardian Contact:</strong> {Data.GuardianContact}</p>
                <p><strong>Attendance:</strong> {Data.Attendance}</p>
            </div>
        );
    })}
</div>


			

			{/* Modal for Add/Edit Student */}
			<div className={`modalOverlay ${Modal ? "ShowModalOverlay" : ""}`}></div>
			<div className={`modalData ${Modal ? "ShowmodalData" : ""}`}>
				<i className="ri-close-large-line" onClick={() => SetModal(false)}></i>
				<h2>STUDENT DATA SHEET FORM</h2>
				<form onSubmit={handlesubmite}>
				<div className="name">
						<label htmlFor="FullName">
							Name <span>*</span>
						</label>
						<input
							type="text"
							id="FullName"
							name="FirstName"
							placeholder="First Name.."
							value={assing.FirstName}
							onChange={handleChanege}
						/>
						<input
							type="text"
							id="middleName"
							name="MiddleName"
							placeholder="Middle Name.."
							value={assing.MiddleName}
							onChange={handleChanege}
						/>
						<input
							type="text"
							id="LastName"
							name="LastName"
							placeholder="Last Name.."
							value={assing.LastName}
							onChange={handleChanege}
						/>
					</div>
					<div className="Class-Details">
						<div className="class">
							<label htmlFor="Class">
								Class <span>*</span>
							</label>
							<select
								className="Classs"
								name="Class"
								value={assing.Class}
								onChange={handleChanege}
							>
								<option value="*">0</option>
								<option value="kg">Kg</option>
								<option value="jn">jn</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
								<option value="6">6</option>
								<option value="7">7</option>
								<option value="8">8</option>
								<option value="9">9</option>
								<option value="10">10</option>
								<option value="11">11</option>
								<option value="12">12</option>
							</select>
						</div>
						<div className="Secton">
							<label htmlFor="Section">
								Section <span>*</span>
							</label>
							<input
								type="text"
								id="Section"
								name="Section"
								placeholder="Section.."
								value={assing.Section}
								onChange={handleChanege}
							/>
						</div>
						<div className="RollNumber">
							<label htmlFor="RollNumber">
								Roll Number <span>*</span>
							</label>
							<input
								type="text"
								id="RollNumber"
								name="RollNumber"
								placeholder="Roll Number"
								value={assing.RollNumber}
								onChange={handleChanege}
							/>
						</div>
						<div className="Gender">
							<label htmlFor="Gender">
								Gender <span>*</span>
							</label>
							<select
								id="Gender"
								name="Gender"
								value={assing.Gender}
								onChange={handleChanege}
							>
								<option value="*">select</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
						</div>
					</div>
					<div className="Social-Details">
						<div className="EMails">
							<label htmlFor="EMail">
								E-Mail ID <span>*</span>
							</label>
							<input
								type="email"
								id="Email"
								name="EmailID"
								placeholder="E-Mails.."
								value={assing.EmailID}
								onChange={handleChanege}
							/>
						</div>
						<div className="PhoneNumber">
							<label htmlFor="Number">
								Phone Number <span>*</span>
							</label>
							<input
								type="text"
								id="Number"
								placeholder="Phone Number.."
								name="PhoneNumber"
								value={assing.PhoneNumber}
								onChange={handleChanege}
							/>
						</div>
					</div>
					<div className="Address">
						<label htmlFor="Address">
							Address <span>*</span>
						</label>
						<input
							type="textarea"
							name="Address"
							id="Addresh"
							value={assing.Address}
							onChange={handleChanege}
						/>
					</div>
					<div className="guardian-Details">
						<div className="guardianName">
							<label htmlFor="guardianName">
								GuardianName <span>*</span>
							</label>
							<input
								type="text"
								placeholder="Guardian Name.."
								id="guardianName"
								name="GuardianName"
								value={assing.GuardianName}
								onChange={handleChanege}
							/>
						</div>
						<div className="guardianContact">
							<label htmlFor="guardianName">
								Guardian Contact <span>*</span>
							</label>
							<input
								type="text"
								placeholder="Guardian Contact.."
								name="GuardianContact"
								id="guardianName"
								value={assing.GuardianContact}
								onChange={handleChanege}
							/>
						</div>
						<div className="Attendance">
							<label htmlFor="guardianName">
								Attendance <span>*</span>
							</label>
							<input
								type="text"
								placeholder="Attendance.. "
								name="Attendance"
								id="guardianName"
								value={assing.Attendance}
								onChange={handleChanege}
							/>
						</div>
					</div>
					<div className="submutebtn">
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Dashboard;
