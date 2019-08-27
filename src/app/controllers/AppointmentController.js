import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import User from '../models/User';
import { startOfHour, parseISO, isBefore } from 'date-fns';

class AppointmentController {
  async index(req, res){
    const appointment = await Appointment.findAll({
      where:{ user_id: req.userId, canceled_at: null },
      order:['date'],
      include: [
        {
           model: User, as: "provider_id"
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

    return res.json(appointment);
  }
}

export default new AppointmentController();