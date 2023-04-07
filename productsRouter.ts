import { Router } from 'express';
import ProductController from './ProductController';

const router = Router();

router.post('/', ProductController.findProducts);

export { router };
