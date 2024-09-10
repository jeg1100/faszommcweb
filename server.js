const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

// Statikus fájlok kiszolgálása (pl. HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// PHP fájlok kiszolgálása
app.get('/*.php', (req, res) => {
    const phpFilePath = path.join(__dirname, 'public', req.path);

    // PHP fájl futtatása
    exec(`php-cgi ${phpFilePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Hiba történt a PHP futtatása közben: ${error.message}`);
            res.status(500).send('Hiba történt a szerver oldalon');
            return;
        }
        if (stderr) {
            console.error(`PHP hibák: ${stderr}`);
        }
        res.send(stdout);
    });
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`Szerver fut a következő címen: http://localhost:${PORT}`);
});
