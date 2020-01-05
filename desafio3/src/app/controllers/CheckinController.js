import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { studentId } = req.params;
    const checkIsStudent = await Student.findByPk(studentId);

    if (!checkIsStudent) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const registrations = await Checkin.findAll({
      where: {
        student_id: studentId,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(registrations);
  }

  async store(req, res) {
    const { studentId } = req.params;

    const checkIsStudent = await Student.findByPk(studentId);

    if (!checkIsStudent) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const checkCount = await Checkin.count({
      where: {
        student_id: studentId,
        created_at: {
          [Op.between]: [startOfWeek(new Date()), endOfWeek(new Date())],
        },
      },
    });

    if (checkCount > 5) {
      return res.status(400).json({ error: 'Maximum checkin exceeded' });
    }

    const checkin = await Checkin.create({
      student_id: studentId,
    });
    return res.json(checkin);
  }
}

export default new CheckinController();
