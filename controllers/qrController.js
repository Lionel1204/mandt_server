const BaseController = require('./baseController');
const qr = require('qrcode');

class QrController extends BaseController {
    constructor() {
        super();
    }

    async post(req, res) {
        const { content } = req.body;
        qr.toDataURL(content, (err, result) => {
            if (err) res.send("Generating QRCode Error");
            res.send(result);
        });
    }
}

module.exports = QrController;

