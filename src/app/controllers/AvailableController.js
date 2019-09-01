import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from 'date-fns';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';

class AvailableController{
  async index(req, res){
    const { date } = req.query;

    if(!date){
      return res.status(400).json({error: 'Data Invalida'});
    }

    const searchDate = parseInt(date);
    // 2019-08-23 17:59:33

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId, 
        canceled_at: null,
        date:{
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        }
      },
    });

    const schedule = [
      '08:00',  // 2019-08-23 08:00:00
      '09:00', // 2019-08-23 09:00:00
      '10:00', // 2019-08-23 10:00:00
      '11:00',
      '14:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    const avaiable = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute),0);
    return {
      time,
      value:
        format(value, "yyy-MM-dd'T'HH:mm:ssxxx"),
      avaiable:
        isAfter(value, new Date()) && !appointment.find(a =>
            format(a.date, 'HH:mm') === time
          ),
    };
    });

    return res.json(avaiable);
    
  }
}
export default new AvailableController();