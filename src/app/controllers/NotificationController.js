import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController{
  async index(req, res) {
    /**
     * Validação para ver se o usuario é um provider!
     */
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if(!checkIsProvider){
      return res.status(401).json({ error: 'Somente providers tem notificações!'})
    }

    /**
     * Ordenando a lista de notificação, puxando do mongo
     */
    const notification = await Notification.find({
      user: req.userId,
    })
    .sort({ createdAt: 'desc' })
    .limit(20);

    return res.json(notification);
  }

  async update(req, res){
   // const notification = await Notification.findById(req.params.id); Forma antiga de fazer
    
    const notification = await Notification.findByIdAndUpdate( //Forma nova
      req.params.id,
      { read: true },
      { new: true }
      );
      return res.json(notification);
  }
}

export default new NotificationController();