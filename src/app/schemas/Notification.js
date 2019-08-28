import mongoose from 'mongoose';
/**
 * Criando uma schema para o mongo db
 * Servirá basicamente para criar avisos a o usuarios, e listar se eles foram lidos ou não!
 * Sem migrations e sem importe
 */
const NotificationSchema = new mongoose.Schema({
  content:{
    type: String,
    required: true,
  },
  user:{
    type: Number,
    required: true,
  },
  read:{
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Notification', NotificationSchema);