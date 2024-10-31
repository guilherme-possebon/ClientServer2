import { Router } from 'express';
import { UsuariosController } from '../controllers/UsuariosController';

let router: Router = Router();

let usuariosController: UsuariosController = new UsuariosController();

router.get('/usuarios', usuariosController.list);
router.get('/usuarios/:id', usuariosController.find);
router.post('/usuarios', usuariosController.create);
router.put('/usuarios/:id', usuariosController.update);
router.delete('/usuarios/:id', usuariosController.delete);

export default router;
