import { Request, Response } from "express";
import Barcode from "../models/barcodeModel";

export const checkBarcode = async (req: Request, res: Response) => {

    const { barcode } = req.body;

    try {

        // check if exist in database, if exist return and if not add barcode
        const barcodeExist = await Barcode.findOne({ where: { barcode } });

        if (barcodeExist) {
            return res.status(409).send({
                success: false,
                message: "Barcode already used",
            });
        }

        await Barcode.create({ barcode });

        return res.status(200).send({
            success: true,
            message: "The barcode is valid",
        });

    } catch (error: any) {

        console.log(error)
        return res.status(500).send({
            success: false,
            message: error.message,
        });

    }
}