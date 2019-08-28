import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR'
import Notification from '../schemas/Notification';

  /**
   * Listagem de serviços de acordo com o token do usuario Não provider, logado!
   * O req.body.userId tem que ser um user não logado! para o index
   */

class AppointmentController {
  async index(req, res){
    const { page = 1 } = req.query;

    const appointment = await Appointment.findAll({
      where:{ user_id: req.userId, canceled_at: null },
      order:['date'],
      attributes: ['id', 'date'],
      limit:20,
      offset: (page - 1) * 20,
      include: [
        {
           model: User, as: "prodiver", attributes: ['id', 'name'],
           include: [{
             model: File, as: 'avatar',
             attributes:['id','path','url']
           }]
        }
      ]
    });

    return res.json(appointment);
  }

  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });
    
    if(!( await schema.isValid(req.body) )){
      return res.status(400).json({ error: 'Erro de validação nos arquivos de agendamento' })
    }

    const { provider_id, date } =req.body;

    /**
     *  Checando se o provider_id é um provider true
     */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if(!checkIsProvider){
      return res.status(401).json({ error: 'Não autorizado a criar registro de agendamento'})
    }

    const hourStart = startOfHour(parseISO(date));

    /**
     * Checando se a data é atual
     */

    if(isBefore(hourStart, new Date())){
      return res.status(400).json({ erro: 'Data invalida para o agendamento' });
    }
    /**
     * Checando se tem essa data disponivel
     */
    const checkAvailability = await Appointment.findOne({
      where:{
        provider_id,
        canceled_at: null,
        date: hourStart,
      }
    });

    if(checkAvailability){
      return res.status(400).json({ error: 'Data indisponível' });
    };

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    })
    /**
     * Notificar o prestador de serviço, - mongo db
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      " 'dia: 'dd 'de 'MMM', às' H:mm'h' ",
      { locale: pt }
      )

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate} `,
      user: provider_id,
    })

    return res.json(appointment);
  }
}

export default new AppointmentController();