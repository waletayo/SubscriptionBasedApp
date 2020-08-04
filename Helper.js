const Q = require("q");
const request = require("request");
const moment = require("moment");

async function verifyPayment(reference) {
    let options = {
        'method': 'GET',
        'url': `https://api.paystack.co/transaction/verify/${reference}`,
        'headers': {
            'Authorization': "Bearer " + process.env.payStack_Secret
        }
    };
    return new Q.Promise(async (resolve, reject) => {
        await request(options, function (error, response) {
            if (error) {
                console.log("error", error);
                return reject(error);
            }
            let verification_response = JSON.parse(response.body);
            if (verification_response.status === true && verification_response.data.status === "success") {
                return resolve(verification_response);
            } else {
                return reject(verification_response)
            }

        });

    });

}

function calculateNextPayment(chargeType, normalDate) {
    let currentDate;
    if (!chargeType) {
        return null;
    }
    if (chargeType === 'Weekly') {
        currentDate = moment(normalDate);
        currentDate.add(7, 'days').format('YYYY-MM-DD hh:mm');
        return currentDate;
    } else if (chargeType === 'Monthly') {
        currentDate = moment(normalDate);
        currentDate.add(30, 'days').format('YYYY-MM-DD hh:mm');
        return currentDate;
    }
}

module.exports.verifyPayment = verifyPayment;
module.exports.calculateNextPayment = calculateNextPayment;
