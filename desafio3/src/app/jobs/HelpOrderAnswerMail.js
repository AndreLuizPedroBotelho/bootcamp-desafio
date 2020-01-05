import Mail from '../../lib/Mail';

class HelpOrderAnswer {
  get key() {
    return 'HelpOrderAnswerMail';
  }

  async handle({ data }) {
    const { studentName, answer, studentEmail, question, answerAt } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${studentName} <${studentEmail}>`,
      subject: 'Resposta Pedido Auxílio',
      template: 'helpOrderAnswer',
      context: { studentName, answer, question, answerAt },
    });
  }
}

export default new HelpOrderAnswer();
