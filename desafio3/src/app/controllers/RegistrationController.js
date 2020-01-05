import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';
import RegistrationMail from '../jobs/RegistrationMail';
import Queue from '../../lib/Queue';

class RegistrationController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const registrations = await Registration.findAll({
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const params = req.body;

    const student = await Student.findByPk(params.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(params.plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    params.price = plan.priceDuration;
    params.end_date = addMonths(parseISO(params.start_date), plan.duration);

    const {
      id,
      plan_id,
      student_id,
      price,
      start_date,
      end_date,
    } = await Registration.create(params);

    const formatMoney = {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL',
    };

    const planPrice = Number(plan.price).toLocaleString('pt-BR', formatMoney);

    const planTxt = `${plan.title} : Plano de ${plan.duration} ${
      plan.duration > 1 ? 'meses' : 'mês'
    } por ${planPrice}${plan.duration > 1 ? '/mês' : ''}`;

    const endDate = format(end_date, 'dd/MM/yyyy', {
      locale: pt,
    });

    await Queue.add(RegistrationMail.key, {
      studentName: student.name,
      price: Number(price).toLocaleString('pt-BR', formatMoney),
      planTxt,
      endDate,
      studentEmail: student.email,
    });

    return res.json({
      id,
      plan_id,
      student_id,
      price,
      start_date,
      end_date,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { registrationId } = req.params;
    const registration = await Registration.findByPk(registrationId, {
      include: ['plan', 'student'],
    });

    if (!registration) {
      return res.status(400).json({ error: 'Registration not found' });
    }

    let { plan } = registration;

    const params = req.body;

    if (params.student_id) {
      const checkIsStudent = await Student.findByPk(params.student_id);

      if (!checkIsStudent) {
        return res.status(400).json({ error: 'Student not found' });
      }
    }

    if (params.plan_id) {
      plan = await Plan.findByPk(params.plan_id);

      if (!plan) {
        return res.status(400).json({ error: 'Plan not found' });
      }
    }

    params.price = plan.priceDuration;

    if (params.start_date) {
      params.end_date = addMonths(parseISO(params.start_date), plan.duration);
    }

    const {
      id,
      plan_id,
      student_id,
      price,
      start_date,
      end_date,
    } = await registration.update(params);

    return res.json({
      id,
      plan_id,
      student_id,
      price,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const { registrationId } = req.params;
    const registration = await Registration.destroy({
      where: {
        id: registrationId,
      },
    });

    if (registration < 1) {
      return res.status(400).json({ error: 'Registration dont exists' });
    }

    return res.json({ success: 'Delete with success' });
  }
}

export default new RegistrationController();
