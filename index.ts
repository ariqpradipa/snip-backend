import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Routes
import checkBarcode from './src/routes/checkBarcodeRoute';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/barcode', checkBarcode);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
