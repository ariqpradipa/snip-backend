import { Request, Response } from "express";

export const checkBarcode = async (req: Request, res: Response) => {
    try {

        res.status(500).send({
            message: "Could not upload the file: ",
        });

    } catch (error) {

        console.log(error)

    }
}