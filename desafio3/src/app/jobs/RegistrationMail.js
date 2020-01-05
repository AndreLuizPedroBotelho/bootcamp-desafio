import Mail from '../../lib/Mail';

class Registration {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { studentName, price, studentEmail, planTxt, endDate } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${studentName} <${studentEmail}>`,
      subject: 'Confirmação Matricula',
      template: 'registration',
      context: {
        studentName,
        price,
        planTxt,
        endDate,
      },
    });
  }
}

export default new Registration();
