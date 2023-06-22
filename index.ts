import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import checkBarcode from './src/routes/checkBarcodeRoute';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/barcode', checkBarcode);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
