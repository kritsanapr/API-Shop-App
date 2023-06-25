import { Router, Response, Request, NextFunction } from 'express'
import { CustomError, requireAuth } from '@shoppingapp/common'
import { buyerService } from './buyer.service';

const router = Router();

router.post('/cart/add', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    const { productId, quantity } = req.body

    const result = await buyerService.addProductToCart({ productId, quantity, userId: req.currentUser!.userId })

    if (result instanceof CustomError || result instanceof Error) return next(result)

    res.status(200).send(result)
})


// router.post('/')

export { router as BuyerRouter }