const express = require('express');
//const http = require('https');
//const socketIo = require('socket.io');
const app = express();
var bodyParser = require('body-parser')
//const server = http.createServer(app);
//const io = socketIo(server);
const cors = require('cors');
const port = process.env.PORT || 8080;
const nodemailer = require('nodemailer');
const path = require('path');
// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs = require('fs').promises;
// const {authPage,authPred} = require('./src/middlewares')

// Serve static files (build folder) for the React app
//app.use(express.static(path.join(__dirname, 'build')));

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.post('/api/emailVerification', jsonParser,async (req, res) => {
  const userPsiholog = req.body;

  const result = await sendEmailVerification(userPsiholog);

  res.json(result);
});
app.post('/api/email',jsonParser, async (req, res) => {
  const userPsiholog = req.body;
  console.log(userPsiholog)

  const result = await sendEmail(userPsiholog);

  res.json(result);
});

app.post('/api/emailPredb',jsonParser, async (req, res) => {
  const predbiljezbe  = req.body.predbiljezbe;
  const userIme = req.body.ime
  const userPrezime = req.body.prezime
  const email = req.body.email
  

  const result = await sendEmailPredbiljezba(predbiljezbe,userIme,userPrezime,email);

  res.json(result);
});

app.post('/api/data',jsonParser, async (req, res) => {
  const data = req.body;

  try {
    const result = await insertData(data);
    res.json(result);
  } catch (error) {
    console.error('Error while handling insert-data request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/predavanjeI', jsonParser,async (req, res) => {
  const data = req.body;

  try {
    console.log("sto sam dobio",data)
    const result = await insertPredavanje(data);
    res.json(result);
  } catch (error) {
    console.error('Error while handling insert-data request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/sazeci', async (req, res) => {
  
  try {
    console.log("call")
    const result = await fetchSazetciWithPsihologData();
    console.log("sazeci",result)
    res.json(result);
  } catch (error) {
    console.error('Error while handling insert-data request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/getPredavanja', async (req, res) => {
  
  try {
    const predavanja = await getPredavanja();
    res.json(predavanja);
    console.log("predavajna",predavanja)
    
  } catch (error) {
    console.error('Error while fetching data:', error);
    socket.emit('fetchingError', 'An error occurred while fetching data.');
  }
}
  );
  app.get('/api/getPredbiljezbe', async (req, res) => {
 // socket.on('getPredbiljezbe', async () => {
    try {
      const predbiljezbe = await getPredbiljezbe();
      console.log(predbiljezbe);
      res.json(predbiljezbe)
      //io.emit('getPredbiljezbe', predbiljezbe);
    } catch (error) {
      console.error('Error while fetching data:', error);
     // io.emit('fetchingError', 'An error occurred while fetching data.');
    }
  });
  app.post('/api/getUser', jsonParser, async (req, res) => {
    // socket.on('getPredbiljezbe', async () => {
       try {
        console.log(req.body)
         const user = await getUser(req.body.psihologID);
         console.log(user);
         res.json(user)
         //io.emit('getPredbiljezbe', predbiljezbe);
       } catch (error) {
         console.error('Error while fetching data:', error);
        // io.emit('fetchingError', 'An error occurred while fetching data.');
       }
     });
//gptsugg

app.post('/api/deletePredavanje', jsonParser,async (req, res) => {
const valuee = req.body.predavanjeID;
try {
  await deletePredavanje(valuee); // Delete the predavanje
  console.log('Deleted predavanje with ID:', valuee);

  // Get the updated predavanja after deletion
  const updatedPredavanja = await getPredavanja();
  console.log('Updated predavanja list:', updatedPredavanja);
  res.json(updatedPredavanja)
  // Emit the updated predavanja list to all clients
  //io.emit('getPredavanja', updatedPredavanja);
} catch (error) {
  console.log('Error while deleting or fetching data:', error);
  socket.emit('fetchingError', 'An error occurred while deleting or fetching data.');
}
});

app.post('/api/createPredbiljezba', jsonParser,async (req, res) => {
  try {
    console.log("Predbilježba_ID: " + req.body.predbiljezbaID);
    console.log("Psiholog_ID: " + req.body.psihologID);
    console.log("Vrijeme predbiljezbe: "+req.body.applicationDate)
    console.log("Predavanje_ID: " + req.body.predID); // Join array elements for logging
  
    const result = await createPredbiljezba(req.body.predbiljezbaID, req.body.psihologID,req.body.applicationDate, req.body.predID );
    console.log("uspio?")
    res.send(result);
  } catch (error) {
    console.log('Error while creating predbiljezba:', error);
   // io.emit('predbiljezbaStatus', 'error');
  }
});
app.post('/api/updatePredavanje', jsonParser,async (req, res) => {
  try {
    // Update the Predavanje data in the database
    const success = await updatePredavanje(req.body);

   /* if (success) {
      // Emit the updated Predavanje data to all clients
     // io.emit('updatedPredavanje', updatedPredavanje);//console log na clinetu


      // Additional logic for updating slobodnaMjesta and brojPolaznika
      const predavanjeID = updatedPredavanje.Predavanje_ID;
      const updatedPredavanjeData = await getPredavanjeByID(predavanjeID); // Fetch updated Predavanje data from the database

      if (updatedPredavanjeData) {
        // Calculate new values for slobodnaMjesta and brojPolaznika
        const newSlobodnaMjesta = Math.max(0, updatedPredavanjeData.slobodnaMjesta);
        const newBrojPolaznika = Math.min(updatedPredavanjeData.ukupnoMjesta, updatedPredavanjeData.brojPolaznika);

        // Update the Predavanje data with new values
        updatedPredavanjeData.slobodnaMjesta = newSlobodnaMjesta;
        updatedPredavanjeData.brojPolaznika = newBrojPolaznika;

        // Update the Predavanje data in the database
        const updateResult = await updatePredavanje(updatedPredavanjeData);
        
      }
    
    } else {
      return res.send('Failed to update Predavanje data in the database.')
    }*/
  } catch (error) {
    console.error('Error while updating Predavanje data:', error);
    return res.send('An error occurred while updating Predavanje data.');
  }
});
app.post('/api/getYourOwnPredbiljezbe', jsonParser,async (req, res) => {
//socket.on('getYourOwnPredbiljezbe', async (psihologID) => {
  try {
    console.log("poszvao svoje pred za id"+req.body.psihologID)
    const predbiljezbe = await getYourOwnPredbiljezbe(req.body.psihologID);
    console.log("Ovo je na serveru moje predb: "+JSON.stringify(predbiljezbe));
    //io.emit('getYourOwnPredbiljezbe', JSON.stringify(predbiljezbe));//ovo na kljentu sredi
    // Emit the array directly
    res.json(predbiljezbe)
  } catch (error) {
    console.error('Error while fetching data:', error);
    io.emit('fetchingError', 'An error occurred while fetching data.');
  }
});



function sendEmailVerification (userPsiholog) {

  console.log(userPsiholog);

  return new Promise((resolve,reject) =>{
      var transporter = nodemailer.createTransport({
          service: "gmail",
          auth:{
              user: process.env.REACT_APP_SENDER,
              pass: process.env.REACT_APP_GOOGLE_PASS,

          }
          ,
      });
      const mail_configs = {
          from: process.env.REACT_APP_SENDER,
          to:   userPsiholog.email,
          subject: "Verifikacija korisničkog računa",
          text: `Pozdrav ${userPsiholog.ime} ${userPsiholog.prezime}, Zahvaljujemo se na zahtjevu za prijavu na stručni skup "Horizonti snage". Molimo Vas da kopirate token koji se nalazi u nastavku te ga zalijepite na traženo mjesto u aplikaciji kako bi dovršili proces prijave.`,
          html: `<p>Pozdrav ${userPsiholog.ime} ${userPsiholog.prezime},</p><p> Zahvaljujemo se na zahtjevu za prijavu na stručni skup "Horizonti snage". Molimo Vas da kopirate token koji se nalazi u nastavku te ga zalijepite na traženo mjesto u aplikaciji kako bi dovršili proces prijave.</p><br><p style='background-color:lightgrey; width:250px; padding:50px;margin:20px;text-align:center;font-weight:bold;font-size: 25px;'>${userPsiholog.tokenGenerated}</p>`     
        };

    //   text: `Pozdrav ${userPsiholog.ime} ${userPsiholog.prezime},Vaša prijava na stručni skup "Horizonti snage" uspješno je izvršena dana ${userPsiholog.date}.Vaša kontakt mail adresa je ${userPsiholog.email}.Čuvajte ovu poruku jer se na njoj nalazi i token s kojim ćete se kasnije prijavljivati na predavanja.Vaš token za prijavu na predavanja: <a href="http://localhost:8080/registrationfeesaccommodation/inserttoken?token=${userPsiholog.Psiholog_ID}">Kliknite ovdje da potvrdite</a>.`
    // };
     transporter.sendMail(mail_configs,function(err,info){
          if(err){
              console.log(err);
              return reject({message: 'an error has occured'});
          }
          return resolve({message:"Vaši podaci uspješno su spremljeni"});
          });

      })
  }

  function sendEmailPredbiljezba (predbiljezbe,ime,prezime,email) {
  
    return new Promise((resolve,reject) =>{
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: process.env.REACT_APP_SENDER,
                pass: process.env.REACT_APP_GOOGLE_PASS,
  
            }
            ,
        });
        const mail_configs = {
            from: process.env.REACT_APP_SENDER,
            to:   email,
            subject: "Potrvda o predbilježbi za predvanje",
            text: `Pozdrav ${ime} ${prezime}, Zahvaljujemo se na zahtjevu za prijavu na stručni skup "Horizonti snage". Molimo Vas da kopirate token koji se nalazi u nastavku te ga zalijepite na traženo mjesto u aplikaciji kako bi dovršili proces prijave.`,
            html: `<p>Pozdrav ${ime} ${prezime},</p><p>Zahvaljujemo se na prijavi za sljedeća predavanja: ${predbiljezbe}</p> `
          };
  
      //   text: `Pozdrav ${userPsiholog.ime} ${userPsiholog.prezime},Vaša prijava na stručni skup "Horizonti snage" uspješno je izvršena dana ${userPsiholog.date}.Vaša kontakt mail adresa je ${userPsiholog.email}.Čuvajte ovu poruku jer se na njoj nalazi i token s kojim ćete se kasnije prijavljivati na predavanja.Vaš token za prijavu na predavanja: <a href="http://localhost:8080/registrationfeesaccommodation/inserttoken?token=${userPsiholog.Psiholog_ID}">Kliknite ovdje da potvrdite</a>.`
      // };
       transporter.sendMail(mail_configs,function(err,info){
            if(err){
                console.log(err);
                return reject({message: 'an error has occured'});
            }
            return resolve({message:"Vaši podaci uspješno su spremljeni"});
            });
  
        })
    }
  
  



// Import database operations
// Import database operations
// const { createPsiholog, getPredavanja, getPredbiljezbe, createPredavanje, deletePredavanje, createPredbiljezba,updatePredavanje, getPredavanjeByID, createSazetci,fetchSazetciWithPsihologData,getYourOwnPredbiljezbe, checkPsihologByToken} = require('./src/dbFiles/dbOperation');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ['https://horizonti-snage.azurewebsites.net']; // Add the URL of your React app

app.use(cors({
  origin: allowedOrigins,
}));
// // const express = require('express');
// const http = require('http');
// const nodemailer = require('nodemailer');
const { createPsiholog, getPredavanja, getPredbiljezbe, createPredavanje, deletePredavanje, createPredbiljezba,updatePredavanje, getPredavanjeByID, createSazetci,fetchSazetciWithPsihologData,getYourOwnPredbiljezbe, getUser} = require('./src/dbFiles/dbOperation');

// const app = express();
// const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function sendEmail(userPsiholog) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.REACT_APP_SENDER,
        pass: process.env.REACT_APP_GOOGLE_PASS,
      },
    });

    const mailConfigs = {
      from:  process.env.REACT_APP_SENDER,
      to: userPsiholog.email,
      subject: 'Potvrda prijave na stručni skup',
      text: `Pozdrav ${userPsiholog.ime} ${userPsiholog.prezime},
       Vaša prijava na stručni skup "Horizonti snage" uspješno je izvršena
       dana ${userPsiholog.date}. Vaša kontakt mail adresa je
       ${userPsiholog.email}. Čuvajte ovu poruku jer se na njoj nalazi i
       token s kojim ćete se kasnije prijavljivati na predavanja. Vaš token
       za prijavu na predavanja: ${userPsiholog.psiholog_ID}`,
    };

    transporter.sendMail(mailConfigs, (err, info) => {
      if (err) {
        console.error(err);
        reject({ message: 'an error has occurred' });
      } else {
        resolve({ message: 'Vaši podaci uspješno su spremljeni' });
      }
    });
  });
}

 function insertData (data)  {
  return new Promise(async (resolve, reject) => {
    try {
      await createPsiholog(data);

      if (data.participantType === 'Aktivni sudionik' && data.uploadedFiles.length > 0) {
        for (let i = 0; i < data.uploadedFiles.length; i++) {
          const uploadedFile = data.uploadedFiles[i].file;
          const oblikSudjelovanja = data.oblikSudjelovanja[i];
          console.log("uploaded files",uploadedFile)
          const sazetciData = {
            Sažetak_ID: data.Sazetci_IDs[i],
            Psiholog_ID: data.Psiholog_ID,
            FileName: uploadedFile.name,
            FileType: uploadedFile.type,
            FileData: Array.from(uploadedFile.content),
            OblikSudjelovanja: oblikSudjelovanja,
            Role: data.role,
            
          };

          await createSazetci(
            sazetciData.Sažetak_ID,
            sazetciData.Psiholog_ID,
            sazetciData.FileName,
            sazetciData.FileType,
            sazetciData.FileData,
            sazetciData.OblikSudjelovanja
          );
        }
      }

      resolve({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error while inserting data:', error);
      reject({ message: 'An error occurred' });
    }
  });
};



function insertPredavanje (data){
  return new Promise(async (resolve, reject) => {
  try {
    setTimeout(async () => {
      await createPredavanje(data);
      return data;
      
    }, 5000);
    // Emit the refresh event
// socket.emit('refreshPage');

resolve({ message: 'Data inserted successfully' });
} catch (error) {
  console.error('Error while inserting data:', error);
  reject({ message: 'An error occurred' });
}
  
});
};


  function fetchSazetci (){
    return new Promise(async (resolve, reject) => {
  try {
    
    const sazetciData = await fetchSazetciWithPsihologData(); // Implement this function
   console.log("sazeci",sazetciData)
    return sazetciData;
    //resolve({ message: 'Data fetched successfully' });
  } catch (error) {
    console.error('Error while inserting data:', error);
    reject({ message: 'An error occurred' });
  }
});
};


function fetchUser (userId){
  return new Promise(async (resolve, reject) => {
try {
  const userData = await getUser(userId); // Implement this function
  return userData;
  //resolve({ message: 'Data fetched successfully' });
} catch (error) {
  console.error('Error while inserting data:', error);
  reject({ message: 'An error occurred' });
}
});
};

// Assuming createPsiholog and createSazetci functions are correctly defined
// ...


// ...

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
