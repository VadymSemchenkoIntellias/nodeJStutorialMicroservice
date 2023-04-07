import { Request, Response } from "express";
import ResponseError, { ErrorResponseStatusMaps } from './error';
import axios from 'axios';

class ProductController {
    async findProducts(req: Request, res: Response) {
        try {
            const result = await axios.post('http://localhost:3000/products', req.body, { params: req.query });
            res.status(200).json(result.data);
        } catch (error: unknown) {
            const status = (error as any)?.response?.status || 500;
            res.status(status).json({ code: (error as ResponseError).code });
        }
    }

}


export default new ProductController();
