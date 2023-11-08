// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Button, Modal, Spinner } from 'react-bootstrap';
// import { nanoid } from 'nanoid';
// import CarouselComponent from './CarouselComponent';
// import { io } from 'socket.io-client';
// import { useNavigate } from 'react-router-dom';
// import '../App.css';

// const getFileDetails = async (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const buffer = event.target.result; // This is the actual file content
//       const name = file.name;
//       const type = file.type;
//       resolve({ name, type, content: buffer }); // Include the content along with metadata
//     };
//     reader.onerror = (error) => {
//       reject(error);
//     };
//     reader.readAsArrayBuffer(file);
//   });
// };

// export default function EventRegistration() {
//   let Psiholog_ID = nanoid(10);
//   let validates = true;
//   const applicationDate = new Date().toLocaleString();
//   const navigate = useNavigate();
//   const socket = io('http://localhost:8080');

//   const [psiholog, setPsiholog] = useState({
//     Psiholog_ID: Psiholog_ID,
//     ime: '',
//     prezime: '',
//     email: '',
//     date: '',
//     participantType: '',
//     uploadedFiles: [],
//     Sazetci_IDs: [],
//     oblikSudjelovanja: [], // Add an array for 'Oblik sudjelovanja'
//   });

//   const [show, setShow] = useState(true);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);

//   const handleInputIme = (e) => {
//     setPsiholog({ ...psiholog, ime: e.target.value });
//   };

//   const handleInputPrezime = (e) => {
//     setPsiholog({ ...psiholog, prezime: e.target.value });
//   };

//   const handleInputEmail = (e) => {
//     setPsiholog({ ...psiholog, email: e.target.value });
//   };

//   const handleParticipantType = (type) => {
//     setPsiholog({ ...psiholog, participantType: type, date: applicationDate });
//     setCurrentStep(1);
//   };

//   const handleFileUpload = (e) => {
//     const newFiles = Array.from(e.target.files);
//     const oblikSudjelovanja = newFiles.map(() => ''); // Initialize with empty values

//     setPsiholog((prevPsiholog) => ({
//       ...prevPsiholog,
//       uploadedFiles: [...prevPsiholog.uploadedFiles, ...newFiles],
//       Sazetci_IDs: [...prevPsiholog.Sazetci_IDs, ...newFiles.map(() => nanoid(5))],
//       oblikSudjelovanja: [...prevPsiholog.oblikSudjelovanja, ...oblikSudjelovanja], // Add the array to state
//     }));
//   };

//   const handleRemoveFile = (index) => {
//     const updatedFiles = [...psiholog.uploadedFiles];
//     updatedFiles.splice(index, 1);

//     const updatedSazetciIDs = [...psiholog.Sazetci_IDs];
//     updatedSazetciIDs.splice(index, 1);

//     const updatedOblikSudjelovanja = [...psiholog.oblikSudjelovanja];
//     updatedOblikSudjelovanja.splice(index, 1);

//     setPsiholog((prevPsiholog) => ({
//       ...prevPsiholog,
//       uploadedFiles: updatedFiles,
//       Sazetci_IDs: updatedSazetciIDs,
//       oblikSudjelovanja: updatedOblikSudjelovanja,
//     }));
//   };

//   const submitValues = async (e) => {
//     e.preventDefault();

//     if (!psiholog.participantType) {
//       alert('Molimo vas odaberite tip sudionika.');
//       return;
//     }

//     if (
//       (psiholog.participantType === 'Aktivni sudionik' && psiholog.uploadedFiles.length === 0) ||
//       !psiholog.ime ||
//       !psiholog.prezime ||
//       !psiholog.email
//     ) {
//       alert('Molimo vas da ispunite sva polja.');
//       return;
//     }

//     // Convert the uploaded files to an array of file details
//     const fileDetailsPromises = psiholog.uploadedFiles.map(async (file) => {
//       const fileDetails = await getFileDetails(file);
//       return {
//         file: fileDetails,
//       };
//     });
//     const filesWithDetails = await Promise.all(fileDetailsPromises);

//     // Rest of the submission logic...

//     const insertionTimeout = setTimeout(() => {
//       setIsWaitingForConfirmation(false);
//       alert('Insertion took longer than expected. Please try again.');
//       setCurrentStep(1); // Go back to Step2
//     }, 20000);

//     // Store Psiholog_ID in local storage
//     localStorage.setItem('psihologID', JSON.stringify(psiholog.Psiholog_ID));
//     console.log('Data before sending to server:', { ...psiholog, uploadedFiles: filesWithDetails });
//     // Pass the modified filesWithDetails array to the server
//     socket.emit('insertData', { ...psiholog, uploadedFiles: filesWithDetails });
//     socket.on('dataInserted', (insertedData) => {
//       console.log('Data inserted:', insertedData);
//       clearTimeout(insertionTimeout); // Clear the timeout
//       setIsWaitingForConfirmation(false);
//       alert('Uspješno pospremljeni prijavni podaci!');
//       navigate('../lectureselection');
//     });
//   };

//   useEffect(() => {
//     socket.on('insertionError', (errorMessage) => {
//       console.error('Error while inserting data:', errorMessage);
//     });
//   }, []);

//   return (
//     <>
//       <CarouselComponent />
//       <Container fluid>
//         <Row>
//           <Modal show={show} onHide={() => setShow(false)} dialogClassName="custom-modal">
//             <Modal.Header closeButton>
//               <Modal.Title style={{ fontSize: '14px' }}>Prijava na konferenciju 'Horizonti snage'</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {currentStep === 0 && (
//                 <Step1 chooseParticipantType={handleParticipantType} />
//               )}
//               {currentStep === 1 && (
//                 <Step2
//                   participantType={psiholog.participantType}
//                   uploadFile={handleFileUpload}
//                   handleInputIme={handleInputIme}
//                   handleInputPrezime={handleInputPrezime}
//                   handleInputEmail={handleInputEmail}
//                   uploadedFiles={psiholog.uploadedFiles}
//                   removeFile={handleRemoveFile}
//                   // Add 'Oblik sudjelovanja' prop and handler
//                   oblikSudjelovanja={psiholog.oblikSudjelovanja}
//                   handleOblikSudjelovanjaChange={(index, value) => {
//                     const updatedOblikSudjelovanja = [...psiholog.oblikSudjelovanja];
//                     updatedOblikSudjelovanja[index] = value;
//                     setPsiholog({ ...psiholog, oblikSudjelovanja: updatedOblikSudjelovanja });
//                   }}
//                 />
//               )}
//               {currentStep === 2 && (
//                 <div className="spinner-container">
//                   <Spinner animation="border" role="status">
//                     <span className="visually-hidden">Loading...</span>
//                   </Spinner>
//                 </div>
//               )}
//             </Modal.Body>
//             {currentStep !== 2 && (
//               <Modal.Footer>
//                 <Button variant="secondary" onClick={() => setShow(false)}>
//                   Close
//                 </Button>
//                 <Button variant="primary" onClick={submitValues}>
//                   Submit
//                 </Button>
//               </Modal.Footer>
//             )}
//           </Modal>
//         </Row>
//       </Container>
//     </>
//   );
// }

// function Step1({ chooseParticipantType }) {
//   return (
//     <Container className="text-center mt-5">
//       <h6 color='dark-blue'>Odaberi tip sudjelovanja na konferenciji 'Horizonti snage': </h6>
//       <Button onClick={() => chooseParticipantType('Aktivni sudionik')} variant="outline-primary">
//         Aktivni sudionik
//       </Button>
//       <hr />
//       <Button onClick={() => chooseParticipantType('Pasivni sudionik')} variant="outline-primary">
//         Pasivni sudionik
//       </Button>
//     </Container>
//   );
// }

// function Step2({
//   participantType,
//   uploadFile,
//   handleInputIme,
//   handleInputPrezime,
//   handleInputEmail,
//   uploadedFiles,
//   removeFile,
//   oblikSudjelovanja,
//   handleOblikSudjelovanjaChange,
// }) {
//   return (
//     <div>
//       <h3>Enter Details</h3>
//       <Form.Group>
//         <Form.Label htmlFor="ime">Ime:</Form.Label>
//         <Form.Control id="ime" name="ime" type="text" placeholder="Unesi ime" onChange={handleInputIme} />
//       </Form.Group>
//       <Form.Group>
//         <Form.Label htmlFor="prezime">Prezime:</Form.Label>
//         <Form.Control id="prezime" type="text" placeholder="Unesi prezime" onChange={handleInputPrezime} />
//       </Form.Group>
//       <Form.Group>
//         <Form.Label htmlFor="email">Email:</Form.Label>
//         <Form.Control id="email" type="email" placeholder="Unesi email" onChange={handleInputEmail} />
//       </Form.Group>
//       {participantType === 'Aktivni sudionik' && (
//         <Form.Group>
//           <Form.Label htmlFor="sazetci">Sažetci:</Form.Label>
//           <Form.Control id="sazetci" type="file" accept=".docx, .pdf, .xlsx" multiple onChange={uploadFile} />
//         </Form.Group>
//       )}
//       {uploadedFiles.length > 0 && (
//         <div>
//           <h5>Uploaded Files:</h5>
//           <ul>
//             {uploadedFiles.map((file, index) => (
//               <li key={index}>
//                 <span>{file.name}</span>
//                 <Form.Group>
//                   <Form.Label>Oblik sudjelovanja:</Form.Label>
//                   <div>
//                     {/* Radio buttons for 'Oblik sudjelovanja' */}
//                     <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_predavanje`}
//                       label="Predavanje"
//                       value="Predavanje"
//                       checked={oblikSudjelovanja[index] === 'Predavanje'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />
//                       <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_primjerdobreprakse`}
//                       label="Primjer dobre prakse"
//                       value="Primjer dobre prakse"
//                       checked={oblikSudjelovanja[index] === 'Primjer dobre prakse'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />

//                       <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_znanstvenirad`}
//                       label="Znanstveni rad"
//                       value="Znanstveni rad"
//                       checked={oblikSudjelovanja[index] === 'Znanstveni rad'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />
//                       <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_radionica`}
//                       label="Radionica"
//                       value="Radionica"
//                       checked={oblikSudjelovanja[index] === 'Radionica'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />

// <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_simpozij`}
//                       label="Simpozij"
//                       value="Simpozij"
//                       checked={oblikSudjelovanja[index] === 'Simpozij'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />
// <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_okruglistol`}
//                       label="Okrugli stol"
//                       value="Okrugli stol"
//                       checked={oblikSudjelovanja[index] === 'Okrugli stol'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />
//                     <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_tedtalk`}
//                       label="Ted talk"
//                       value="Ted talk"
//                       checked={oblikSudjelovanja[index] === 'Ted talk'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />
//                     <Form.Check
//                       type="radio"
//                       name={`oblikSudjelovanja_${index}`}
//                       id={`oblikSudjelovanja_${index}_outofthebox`}
//                       label="Out of the box"
//                       value="Out of the box"
//                       checked={oblikSudjelovanja[index] === 'Out of the box'}
//                       onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
//                     />


//                     {/* Add radio buttons for other 'Oblik sudjelovanja' options here */}
//                   </div>
//                 </Form.Group>
//                 <button onClick={() => removeFile(index)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, Spinner } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import CarouselComponent from './CarouselComponent';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { target } from 'tailwindcss/stubs/defaultConfig.stub';

const getFileDetails = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target.result;
      const name = file.name;
      const type = file.type;
      resolve({ name, type, content: buffer });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

export default function  EventRegistration({role}) {
  let Psiholog_ID = nanoid(10);
  let tokenGenerated = nanoid(15)
  let validates = true;
  const applicationDate = new Date().toLocaleString();
  const navigate = useNavigate();
  const socket = io('http://localhost:3000');

  const [psiholog, setPsiholog] = useState({
    Psiholog_ID: Psiholog_ID,
    tokenGenerated: tokenGenerated,
    tokenInserted : null,
    ime: '',
    prezime: '',
    email: '',
    date: '',
    participantType: '',
    uploadedFiles: [],
    Sazetci_IDs: [],
    oblikSudjelovanja: [],
    role: 'user',
  });
  const odborMails = process.env.REACT_APP_ODBOR_MAILS.split(',').map((email) => email.trim());

  const [show, setShow] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);

  const handleInputIme = (e) => {
    setPsiholog({ ...psiholog, ime: e.target.value });
  };

  const handleToken = (e) => {
   // console.log("!ovoo"+e.target.value)
    const targetID = e.target.value
    const savedID = localStorage.getItem(psiholog.ime+psiholog.prezime+psiholog.email)
    console.log("ispravni:"+targetID+"saveani:"+savedID)
    setPsiholog({ ...psiholog, tokenInserted: e.target.value });

    

  };
  const handleTokenS = (e) => {
    console.log("!ovoo"+psiholog.tokenInserted)
    const targetID = e.target.value
    const savedID = localStorage.getItem(psiholog.ime+psiholog.prezime+psiholog.email)
    console.log("ispravni:"+targetID+"saveani:"+savedID)
    

    

  };

  const handleInputPrezime = (e) => {
    
    setPsiholog({ ...psiholog, prezime: e.target.value });
  };

  const handleInputEmail = (e) => {
    const email = e.target.value;
    let role = 'user';

    if (email === process.env.REACT_APP_ADMIN_MAIL) {
      role = 'admin';
    } else if (odborMails.includes(email)) {
      console.log(odborMails);
      role = 'odbor';
    }
// When the user selects a role, store it in localStorage
   localStorage.setItem('userRole', role);
    setPsiholog({ ...psiholog, email, role });
  };

  const handleParticipantType = (type) => {
    setPsiholog({ ...psiholog, participantType: type, date: applicationDate });
    setCurrentStep(1);
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const oblikSudjelovanja = newFiles.map(() => '');

    setPsiholog((prevPsiholog) => ({
      ...prevPsiholog,
      uploadedFiles: [...prevPsiholog.uploadedFiles, ...newFiles],
      Sazetci_IDs: [...prevPsiholog.Sazetci_IDs, ...newFiles.map(() => nanoid(5))],
      oblikSudjelovanja: [...prevPsiholog.oblikSudjelovanja, ...oblikSudjelovanja],
    }));
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...psiholog.uploadedFiles];
    updatedFiles.splice(index, 1);

    const updatedSazetciIDs = [...psiholog.Sazetci_IDs];
    updatedSazetciIDs.splice(index, 1);

    const updatedOblikSudjelovanja = [...psiholog.oblikSudjelovanja];
    updatedOblikSudjelovanja.splice(index, 1);

    setPsiholog((prevPsiholog) => ({
      ...prevPsiholog,
      uploadedFiles: updatedFiles,
      Sazetci_IDs: updatedSazetciIDs,
      oblikSudjelovanja: updatedOblikSudjelovanja,
    }));
  };
 

  const submitValues = async (e) => {
    e.preventDefault();
    console.log("dobuiveni:"+psiholog.tokenInserted+"generirani:"+psiholog.tokenGenerated)
    
    if(psiholog.tokenInserted == psiholog.tokenGenerated){


    const fileDetailsPromises = psiholog.uploadedFiles.map(async (file) => {
      const fileDetails = await getFileDetails(file);
      return {
        file: fileDetails,
      };
    });
    const filesWithDetails = await Promise.all(fileDetailsPromises);
   
    
    console.debug("LAA");

    //localStorage.setItem('psihologID', JSON.stringify(psiholog.Psiholog_ID));
    console.log('Data before sending to server:', { ...psiholog, uploadedFiles: filesWithDetails });

    socket.emit('insertData', { ...psiholog, uploadedFiles: filesWithDetails });
    socket.emit('sendEmail', { ...psiholog, uploadedFiles: filesWithDetails });
    


    socket.on('dataInserted', (insertedData) => {
      console.log('Data inserted:', insertedData);
      //clearTimeout(insertionTimeout);
      setIsWaitingForConfirmation(false);
      alert('Uspješno pospremljeni prijavni podaci!');
      navigate('../lectureselection');
    });

  }
  else {
    alert("Uneseni token se ne podudara s poslanim na e-mail. Molimo provjerite unesene podatke")
  }
  };


  const sendEmail = async (e) => {
    e.preventDefault();
   

    if (!psiholog.participantType) {
      alert('Molimo vas odaberite tip sudionika.');
      return;
    }

    if (
      (psiholog.participantType === 'Aktivni sudionik' && psiholog.uploadedFiles.length === 0) ||
      !psiholog.ime ||
      !psiholog.prezime ||
      !psiholog.email
    ) {
      alert('Molimo vas da ispunite sva polja.');
      return;
    }

    const fileDetailsPromises = psiholog.uploadedFiles.map(async (file) => {
      const fileDetails = await getFileDetails(file);
      return {
        file: fileDetails,
      };
    });
    const filesWithDetails = await Promise.all(fileDetailsPromises);
    localStorage.setItem(JSON.stringify(psiholog.Psiholog_ID),psiholog.ime+psiholog.prezime+psiholog.email)
    
    console.debug("LAA");

    //localStorage.setItem('psihologID', JSON.stringify(psiholog.Psiholog_ID));
   

    //fist send e-mail with id
//premjesti ovo u novu metodu koja ce emitat nakon sto se klikne check token
   socket.emit('sendEmailVerification', { ...psiholog, uploadedFiles: filesWithDetails });
    //socket.emit('insertData', { ...psiholog, uploadedFiles: filesWithDetails });
    setCurrentStep(2)
    
  };


  useEffect(() => {
    socket.on('insertionError', (errorMessage) => {
      console.error('Error while inserting data:', errorMessage);
    });
  }, []);

  return (
    <>
      <CarouselComponent />
      <Container fluid>
        <Row>
          <Modal show={show} onHide={() => setShow(false)} dialogClassName="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '14px' }}>Prijava na konferenciju 'Horizonti snage'</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {currentStep === 0 && <Step1 chooseParticipantType={handleParticipantType} />}
              
              
              {currentStep === 1 && (
                <Step2
                  participantType={psiholog.participantType}
                  uploadFile={handleFileUpload}
                  handleInputIme={handleInputIme}
                  handleInputPrezime={handleInputPrezime}
                  handleInputEmail={handleInputEmail}
                  uploadedFiles={psiholog.uploadedFiles}
                  removeFile={handleRemoveFile}
                  oblikSudjelovanja={psiholog.oblikSudjelovanja}
                  handleOblikSudjelovanjaChange={(index, value) => {
                    const updatedOblikSudjelovanja = [...psiholog.oblikSudjelovanja];
                    updatedOblikSudjelovanja[index] = value;
                    setPsiholog({ ...psiholog, oblikSudjelovanja: updatedOblikSudjelovanja });
                    //setCurrentStep(2)
                  }}
                
                />
              )}
               {currentStep === 2 && (
                <Step3
                handleToken={handleToken}
          
                />
              )}
              {currentStep === 3 && (
                <div className="spinner-container">
                  <Spinner animation="border" role="status">
                    <span className="visually-impaired">Loading...</span>
                  </Spinner>
                </div>
              )}
               {currentStep === 4 && (
                <div className="spinner-container">
                  <Spinner animation="border" role="status">
                    <span className="visually-impaired">Loading...</span>
                  </Spinner>
                </div>
              )}
            </Modal.Body>
            {currentStep === 2 && (
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={submitValues}>
                  Submit
                </Button>
              </Modal.Footer>
            )}
            {currentStep === 1 && (
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={sendEmail}>
                  Next
                </Button>
              </Modal.Footer>
            )}
          </Modal>
        </Row>
      </Container>
    </>
  );
}

function Step1({ chooseParticipantType }) {
  return (
    <Container className="text-center mt-5">
      <h6 color='dark-blue'>Odaberi tip sudjelovanja na konferenciji 'Horizonti snage': </h6>
      <Button onClick={() => chooseParticipantType('Aktivni sudionik')} variant="outline-primary">
        Aktivni sudionik
      </Button>
      <hr />
      <Button onClick={() => chooseParticipantType('Pasivni sudionik')} variant="outline-primary">
        Pasivni sudionik
      </Button>
    </Container>
  );
}

function Step2({
  participantType,
  uploadFile,
  handleInputIme,
  handleInputPrezime,
  handleInputEmail,
  uploadedFiles,
  removeFile,
  oblikSudjelovanja,
  handleOblikSudjelovanjaChange,
}) {
  return (
    <div>
      <h3>Enter Details</h3>
      <Form.Group>
        <Form.Label htmlFor="ime">Ime:</Form.Label>
        <Form.Control id="ime" name="ime" type="text" placeholder="Unesi ime" onChange={handleInputIme} />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="prezime">Prezime:</Form.Label>
        <Form.Control id="prezime" type="text" placeholder="Unesi prezime" onChange={handleInputPrezime} />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="email">Email:</Form.Label>
        <Form.Control id="email" type="email" placeholder="Unesi email" onChange={handleInputEmail} />
      </Form.Group>
      {participantType === 'Aktivni sudionik' && (
        <Form.Group>
          <Form.Label htmlFor="sazetci">Sažetci:</Form.Label>
          <Form.Control id="sazetci" type="file" accept=".docx, .pdf, .xlsx" multiple onChange={uploadFile} />
        </Form.Group>
      )}
      {uploadedFiles.length > 0 && (
        <div>
          <h5>Uploaded Files:</h5>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>
                <span>{file.name}</span>
                <Form.Group>
                  <Form.Label>Oblik sudjelovanja:</Form.Label>
                  <div>
                    {/* Radio buttons for 'Oblik sudjelovanja' */}
                    <Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_predavanje`}
                      label="Predavanje"
                      value="Predavanje"
                      checked={oblikSudjelovanja[index] === 'Predavanje'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />
                      <Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_primjerdobreprakse`}
                      label="Primjer dobre prakse"
                      value="Primjer dobre prakse"
                      checked={oblikSudjelovanja[index] === 'Primjer dobre prakse'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />

                      <Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_znanstvenirad`}
                      label="Znanstveni rad"
                      value="Znanstveni rad"
                      checked={oblikSudjelovanja[index] === 'Znanstveni rad'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />
                      <Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_radionica`}
                      label="Radionica"
                      value="Radionica"
                      checked={oblikSudjelovanja[index] === 'Radionica'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />

<Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_simpozij`}
                      label="Simpozij"
                      value="Simpozij"
                      checked={oblikSudjelovanja[index] === 'Simpozij'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />
<Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_okruglistol`}
                      label="Okrugli stol"
                      value="Okrugli stol"
                      checked={oblikSudjelovanja[index] === 'Okrugli stol'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_tedtalk`}
                      label="Ted talk"
                      value="Ted talk"
                      checked={oblikSudjelovanja[index] === 'Ted talk'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />
                    <Form.Check
                      type="radio"
                      name={`oblikSudjelovanja_${index}`}
                      id={`oblikSudjelovanja_${index}_outofthebox`}
                      label="Out of the box"
                      value="Out of the box"
                      checked={oblikSudjelovanja[index] === 'Out of the box'}
                      onChange={(e) => handleOblikSudjelovanjaChange(index, e.target.value)}
                    />


                    {/* Add radio buttons for other 'Oblik sudjelovanja' options here */}
                  </div>
                </Form.Group>
                <button onClick={() => removeFile(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
   }

  function Step3({
   
    handleToken
    
  }) {
    return (
      <div>
        <h3>Enter Details</h3>
        <Form.Group>
          <Form.Label htmlFor="token">Token:</Form.Label>
          <Form.Control id="token" name="token" type="text" placeholder="Unesite token dobiven e-mailom" onChange={handleToken} />
        </Form.Group>
       
      </div>)




}

 