const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authr');
const diningRoutes = require('./src/routes/dining');

const app = express();
app.use(bodyParser.json());
    
app.use('/api', authRoutes);
app.use('/api', diningRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the API'); // Replace with your desired response
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
