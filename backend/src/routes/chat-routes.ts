import {Router} from 'express';
import { verifyToken } from '../utils/tokens-manager.js';
import { chatCompletetionValidator, validate } from '../utils/validators.js';
import { deleteChats, generateChatCompletion, sendChatsToUser } from '../controllers/chat-controllers.js';

//Protected API
const chatRoutes = Router();
chatRoutes.post('/new', validate(chatCompletetionValidator), verifyToken, generateChatCompletion);
chatRoutes.get('/all-chats', verifyToken, sendChatsToUser);
chatRoutes.delete('/delete-chats', verifyToken, deleteChats);

export default chatRoutes;