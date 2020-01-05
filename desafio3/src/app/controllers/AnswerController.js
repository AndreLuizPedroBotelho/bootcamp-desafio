import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import HelpOrderAnswerMail from '../jobs/HelpOrderAnswerMail';
import Queue from '../../lib/Queue';

class AnswerController {
  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { helpOrdersId } = req.params;

    const helpOrder = await HelpOrder.findByPk(helpOrdersId, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help Order not found' });
    }

    const { question, answer, answer_at, student } = await helpOrder.update(
      {
        answer: req.body.answer,
        answer_at: new Date(),
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

    const answerAt = format(answer_at, 'dd/MM/yyyy', {
      locale: pt,
    });
    await Queue.add(HelpOrderAnswerMail.key, {
      answerAt,
      studentEmail: helpOrder.student.email,
      studentName: helpOrder.student.name,
      question,
      answer,
    });
    return res.json({ question, answer, answer_at, student });
  }
}

export default new AnswerController();
