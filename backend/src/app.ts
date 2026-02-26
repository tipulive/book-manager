import express from 'express';
import cors from 'cors';
import {env} from './config/env.js';
import authRoutes from './routes/authRoutes.js';



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
//app.use('/api/books', bookRoutes);

const PORT = env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));