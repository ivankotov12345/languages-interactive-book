import express from 'express';

const PORT = 3001;
const MESSAGE = `server running on port ${PORT}`;

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: MESSAGE
    })
})

app.listen(PORT, () => {
    console.log(MESSAGE);
});