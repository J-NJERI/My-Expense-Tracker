const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path')
const {readdirSync} = require('fs');

const app = express();

dotenv.config();

//middleware
app.use(express.json())
app.use(cors())

app.use(express.static(path.join(__dirname, '../Frontend/public')));

//routes
readdirSync('./routes').forEach((file) => {
    if (file.endsWith('.js')) {
        const routePath = `./routes/${file}`;
        app.use('/api/v1', require(routePath));
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/public', 'index.html'));
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Something went wrong!'});
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
