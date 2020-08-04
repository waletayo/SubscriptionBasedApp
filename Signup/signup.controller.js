const {verifyPayment, calculateNextPayment} = require("../Helper");

const {register} = require("./signup.model");
const _ = require("underscore");
const vm = require("v-response");
const bcrypt = require("bcrypt");
const Plan = require("../Plan /plan.model");
const jwt = require('jsonwebtoken');

//create user account and charge card
exports.createAccount = async (req, res, next) => {
    try {
        const find_plan_selected = await Plan.findById(req.body.plan);
        if (!find_plan_selected) {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, 'Invalid plan selected'))
        } else if (find_plan_selected) {
            //verify transaction and create user account
            //so here because we are using paystack so the payment initilization happens on the we so the refernce number from paystack
            //after a succcessfully payment will be passed here
            const check_payment = verifyPayment(req.body.reference);
            //if refernce is valid
            if (check_payment) {
                let nextpaymentDate;
                let date = Date.now();
                nextpaymentDate = await calculateNextPayment(find_plan_selected.name, date)
                const check_email = await register.findOne({email: req.body.email});
                if (check_email) {
                    return res.status(400)
                        .json(vm.ApiResponse(false, 400, 'Email Already exist'))
                }
                let registration_body = req.body;
                const create_new_user = new register(registration_body);
                registration_body.password = bcrypt.hashSync(req.body.password, 10);
                registration_body.is_paid = true;
                registration_body.next_payment_date = nextpaymentDate;
                const save_user = create_new_user.save();
                if (save_user) {
                    return res.status(201)
                        .json(vm.ApiResponse(true, 200, `account created successfully and sub wil expire by ${nextpaymentDate} `, save_user))
                }
            }
            //if reference is invalid
            if (!check_payment) {
                return res.status(400)
                    .json(vm.ApiResponse(false, 400, 'Oops! an error occur'))
            }
        }
    } catch (e) {
        return res.status(500)
    }
};


exports.login = async (req, res, next) => {
    const find_user_by_email = await register.findOne({email: req.body.email});
    if (!find_user_by_email) {
        return res.status(400)
            .json(vm.ApiResponse(false, 400, "Hoops cant find a user with the provided email address please check "))

    } else {
        //check if user subscription is acive
        if (find_user_by_email.is_paid === false) {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, 'please subscribe to continue'))
        }
        const match = await bcrypt.compare(req.body.password, find_user_by_email.password);
        if (!match) {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, "incorrect password please check and try again "))

        }
        //check access
        else if (match && find_user_by_email.is_paid === true) {
            const payload = {id: find_user_by_email.id};
            jwt.sign(payload, "keys", {expiresIn: "365d"}, (error, token) => {
                return res.status(200)
                    .json(vm.ApiResponse(true, 200, "login successful", {
                        user: find_user_by_email,
                        toke: "Bearer " + token
                    }));

            })

        }

    }
}
