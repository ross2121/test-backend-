const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const cors = require("cors");

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

app.post("/extract-pdf", upload.single("document"), async (req, res) => {
    try {
        const inputPath = req.file.path;
        const dataBuffer = fs.readFileSync(inputPath);
        const data = await pdf(dataBuffer);

        console.log("Extracted Text:", data.text);  

       
        const nameMatch = data.text.match(/Name:\s*([A-Za-z\s]+)/i);
        const expirationDateMatch = data.text.match(/expirationdate[-\s]*([\d]{2}\.\d{2}\.\d{2})/i);
        const documentNumberMatch = data.text.match(/documentnumber\s*:\s*([0-9]+)/i);

        const extractedData = {
            name: nameMatch ? nameMatch[1].trim() : "Not found",
            expirationDate: expirationDateMatch ? expirationDateMatch[1].trim() : "Not found",
            documentNumber: documentNumberMatch ? documentNumberMatch[1].trim() : "Not found",
        };

      
    

        console.log("Extracted Data:", extractedData);

       
        fs.unlinkSync(inputPath);
        
      
        res.json({ extractedData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error processing the document.", error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
