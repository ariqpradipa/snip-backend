import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import checkBarcode from './routes/checkBarcodeRoute';

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/barcode', checkBarcode);

app.get('/', (req, res) => {

    res.status(200).json({ message: 'Snip Backend API request' });

});

export default app;