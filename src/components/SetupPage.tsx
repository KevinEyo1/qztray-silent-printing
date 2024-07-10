import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PrinterSetup from './PrinterSetup'
import HomePage from './HomePage';
import { useEffect, useState } from 'react';
import qz from 'qz-tray';
import { AppBar, Button, Container, CssBaseline, Toolbar, Typography } from '@mui/material';
import { Printer, SavedSetting } from '../data/printerData';
import { KEYUTIL, stob64, hextorstr, KJUR } from 'jsrsasign';


function SetupPage() {
  const [clientPrinters, setClientPrinters] = useState<Printer[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [printersLoading, setPrintersLoading] = useState(true);
  const [savedSettings, setSavedSettings] = useState<SavedSetting[]>([]);

  useEffect(() => {
    // Load saved settings from local storage
    const saved = JSON.parse(localStorage.getItem('printerSettings') || '[]');
    setSavedSettings(saved);

    

    qz.security.setCertificatePromise(function(resolve, reject) {
        //Preferred method - from server
    //        fetch("assets/signing/digital-certificate.txt", {cache: 'no-store', headers: {'Content-Type': 'text/plain'}})
    //          .then(function(data) { data.ok ? resolve(data.text()) : reject(data.text()); });
    
        //Alternate method 1 - anonymous
    //        resolve();  // remove this line in live environment
    
        //Alternate method 2 - direct
        resolve("-----BEGIN CERTIFICATE-----\n" +
"MIIECzCCAvOgAwIBAgIGAZCauxNRMA0GCSqGSIb3DQEBCwUAMIGiMQswCQYDVQQG\n" +
"EwJVUzELMAkGA1UECAwCTlkxEjAQBgNVBAcMCUNhbmFzdG90YTEbMBkGA1UECgwS\n" +
"UVogSW5kdXN0cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMx\n" +
"HDAaBgkqhkiG9w0BCQEWDXN1cHBvcnRAcXouaW8xGjAYBgNVBAMMEVFaIFRyYXkg\n" +
"RGVtbyBDZXJ0MB4XDTI0MDcwOTAzNDEwOVoXDTQ0MDcwOTAzNDEwOVowgaIxCzAJ\n" +
"BgNVBAYTAlVTMQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYD\n" +
"VQQKDBJRWiBJbmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMs\n" +
"IExMQzEcMBoGCSqGSIb3DQEJARYNc3VwcG9ydEBxei5pbzEaMBgGA1UEAwwRUVog\n" +
"VHJheSBEZW1vIENlcnQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDF\n" +
"wiEfjZmcEwfJF/qsSKQOnfEP3bG6FK+XcVAZ0fcr/XasoJd8ec52LsfqogkfqSZi\n" +
"XYS4Zgf7P+1XEiZdPbLopqr3klA9UjdqNKyJEnQtnKNtrSKecGj+lBC7cgk8DYtb\n" +
"txxyk5yVg/ie1RGrrh7CL7vpp6kevPS7vN7uD/RmWwBwACKpPGct5ezcdtx4gB33\n" +
"/Gzs1XI0Fq9ZvPezrnsSfA/rrx28FhkCOkUndGBpH536xwktydmq0yt850bFoU3O\n" +
"PHzTnNQ3nc90amgY4mpUelCqbwdsd1ePq4nrJFNxNYhPwUssBBVSYc759Qx+55Xz\n" +
"DLqsgqJTrU4eMh7ECcZdAgMBAAGjRTBDMBIGA1UdEwEB/wQIMAYBAf8CAQEwDgYD\n" +
"VR0PAQH/BAQDAgEGMB0GA1UdDgQWBBQAlSmygELDQVWKDTIR9C9m5tFH7TANBgkq\n" +
"hkiG9w0BAQsFAAOCAQEAS7TJJVyF1r/BeuUusqVxPDOd6Y8eODQ7vqnI8amoqvTy\n" +
"BZCh1m4c0gOmuOM9F+1+1toyThOznImikZC285Ifpq6wV6iCKbf8efr/G4+iYAFW\n" +
"fQhTMJG/rfwJnu5mz1PYCs4vs31r5L0lcK6nvz0HHE6r7mvJLI4962WWVK2WfBCg\n" +
"VdNERV4S4HEzBQihH3lrbSmDFnk4D28xZ1k/bqbyXcdRP15eXu0HIHg9eNVhU3/b\n" +
"y5lsOg+13jZMEowOJ/DJE/NfqhaBJBaZa5IKzWmGQS4ABAXVELC3/dXJSP4abH6I\n" +
"L0HDUHPsmR8RIic6oStNuGQAEHYWh+9Ok9zc7Rki9Q==\n" +
"-----END CERTIFICATE-----");
    });

  var privateKey = "-----BEGIN PRIVATE KEY-----\n" +
"MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFwiEfjZmcEwfJ\n" +
"F/qsSKQOnfEP3bG6FK+XcVAZ0fcr/XasoJd8ec52LsfqogkfqSZiXYS4Zgf7P+1X\n" +
"EiZdPbLopqr3klA9UjdqNKyJEnQtnKNtrSKecGj+lBC7cgk8DYtbtxxyk5yVg/ie\n" +
"1RGrrh7CL7vpp6kevPS7vN7uD/RmWwBwACKpPGct5ezcdtx4gB33/Gzs1XI0Fq9Z\n" +
"vPezrnsSfA/rrx28FhkCOkUndGBpH536xwktydmq0yt850bFoU3OPHzTnNQ3nc90\n" +
"amgY4mpUelCqbwdsd1ePq4nrJFNxNYhPwUssBBVSYc759Qx+55XzDLqsgqJTrU4e\n" +
"Mh7ECcZdAgMBAAECggEAAZcoQVkEWHrXUTBAfWVNFlI9BItXSQqax4kGYSADK/cX\n" +
"bY3W7vpFp7vTC3mT/EiV0w8pLXsYSGo+lriuVuwYarhu5H43Nl+oIdI6A3eWhv7E\n" +
"bgWwmUd07kEQwCdVZ18pcBHbFy0eR2zxNlNYXGvhJoaorSgWMVgrsivCYuwRAPkb\n" +
"DKgnoES8KUxIrNHFph3VmXqGl8HjjPHgxVAvX5E+YqxOTw5q1wTUQWampmdrR+30\n" +
"+oYGG7/Y2FXXJpxb5ZixxBYs/qVPXofa0dGGEcTSsLXir33VNiBJNMEPo47iLp9V\n" +
"UydzPfJvsAEmqqC14JwL9Mt+DV35tJb930X8gAudsQKBgQD/SE8Q5BiuglsDrFCH\n" +
"0tyLkRoZ79XjtuLGULYY2+mD2ozgl69OzplGCG33a/bbddWQmZKjQYQrZtSFO72f\n" +
"F5anzyvJs5H/i4GS10JakSNuDLyrucyBmEFmj63iDjFfPF6KgC4OdvA/TWB44Nyg\n" +
"p4PUxcNkR3sFRkzvcO8snvPFwwKBgQDGUG2ue2/hFDywdfKehvRpClEHTlyMg9Tt\n" +
"KgnTKCuVOQStLAskT4j7ln/pijbo8mOdXHVmG5fiyCUoM80gOq5zjYPYYuuqAh6R\n" +
"4bwO64QHyjnT8bpkOUF5YwSjYLr2nQOzhh6zlcaGrJMX4v/3OwgrLFvUtPg5Bd1O\n" +
"VU6QKwHhXwKBgQCiLqosrP0RQTfZaYvv/oKnGJRgjgJxHSuNmpFV0cDVR+/gb/2s\n" +
"L40o9QoH+stmOcJoj2id123EtRunWYDqpe3Mxs2m4zKKC3NSevdo2nSL4gOrherr\n" +
"GnPSWM27pBCx1ISrsSuRfPa9AMedhB4m4sXaU5oDB3acr0EJjdIlowZ0SQKBgAI+\n" +
"BI91e9VaqjkAjGa4dej+Id5oR2mbT/wCfqvxh1SfmWrv1Yxqjczyba3RTz+hBflQ\n" +
"g09NPpFk2+6xbz9PCovp7LS0oZ+BeKEDoWG1zf9cjPzVfdsGPrRFp1bFkDebnOAZ\n" +
"wx0as2zwZJVfjq9X7oa2cK9eAHR8mXz6P/InWlUXAoGBAJskVmQP3So4hP+zoJbX\n" +
"5qygDMLueFkzCgRT57/00DYENUhIptWZ2mXZNr9NWMnei5hOO1nU5UercTR8uqo+\n" +
"fiPG9fO8rES7tsPPSYVuzRL1P5Wwr1zYVdniJn0pWjIVT2vjqaO6TUnpT1S6w8+R\n" +
"YYZpM/0c9tCvvVxz7MocMIOm\n" +
"-----END PRIVATE KEY-----";

    qz.security.setSignatureAlgorithm("SHA512"); // Since 2.1
    qz.security.setSignaturePromise(function(toSign) {
        return function(resolve, reject) {
            try {
                var pk = KEYUTIL.getKey(privateKey);
                var sig = new KJUR.crypto.Signature({"alg": "SHA512withRSA"});  // Use "SHA1withRSA" for QZ Tray 2.0 and older
                sig.init(pk); 
                sig.updateString(toSign);
                var hex = sig.sign();
                console.log("DEBUG: \n\n" + stob64(hextorstr(hex)));
                resolve(stob64(hextorstr(hex)));
            } catch (err) {
                console.error(err);
                reject(err);
            }
        };
    });
    // time delay
    setTimeout(() => {
      qz.websocket.connect().then(() => {
        return qz.printers.find();
      }).then((printers: Printer[]) => {
        console.log(printers);
        setClientPrinters(printers);
        setSelectedPrinter(printers.length > 0 ? printers[0].name : "");
        setPrintersLoading(false);
      }).catch((err: Error) => {
        console.error(err.message);
      });
    }, 1000);
    
    
  }, []);

  return (
    <>
    <Router>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            POC
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/other">
            Other
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* This toolbar is a spacer to push content below the AppBar */}
      <Container>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/other" element={<PrinterSetup clientPrinters={clientPrinters} selectedPrinter={selectedPrinter} setSelectedPrinter={setSelectedPrinter} printersLoading={printersLoading} savedSettings={savedSettings} setSavedSettings={setSavedSettings} />} />
        </Routes>
      </Container>
    </Router>                    
    </>
  )
}

export default SetupPage

