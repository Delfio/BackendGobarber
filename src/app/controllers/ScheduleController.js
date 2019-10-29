import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
/**
 * Listagem dos serviços para o prestador de serviço! com verificação e tudo
 */
class ScheduleController {

  async index(req, res){
    const checkUserProvider = await User.findOne({
      where:{ id: req.userId, provider: true  },
    });
    //Verifica se o user é um provider!
    if(!checkUserProvider){
      return res.status(401).json({ error: 'Você não é um prestador de serviço' })
    }

    /**
     * Criando uma função para avisar ou "priorizar" serviços que são no dia atual
     */
    const { date } = req.query;
    const parsedDate = parseISO(date); // Formatando a data para a verificação

    //retorna todos os agendamentos do dia
    //percorrendo as 24h
    //ex: 2019-09-15 00:00:00 (hora inicial) 23:59:00 (hora final)
    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date:{
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ],
      order: ['date']
    })

    return res.json(appointment);
  }

}

export default new ScheduleController();