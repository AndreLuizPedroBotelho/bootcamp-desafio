import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class StudentHelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { studentId } = req.params;
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
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
    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    req.body.student_id = studentId;
    const helpOrder = await HelpOrder.create(
      {
        student_id: studentId,
        question: req.body.question,
      },
      {
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name'],
          },
        ],
      }
    );

    return res.json(helpOrder);
  }
}

export default new StudentHelpOrderController();
