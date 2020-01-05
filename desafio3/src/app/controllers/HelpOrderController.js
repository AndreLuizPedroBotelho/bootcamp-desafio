import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
      order: ['id'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
