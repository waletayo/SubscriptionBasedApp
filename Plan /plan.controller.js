const planModel = require("./plan.model");
const _ = require("underscore");
const vm = require("v-response");
exports.createPlan = async (req, res, next) => {
    try {
        if (!req.body.price || !req.body.name) {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, 'all fields are required'))
        }
        const _expected_body = _.pick(req.body, ['price', 'name']);
        const create_plan = new planModel(_expected_body);
        const save_plan = create_plan.save();
        if (save_plan) {
            return res.status(200)
                .json(vm.ApiResponse(true, 200, 'success', save_plan))
        } else {
            return res.status(400)
                .json(vm.ApiResponse(false, 400, 'Oops! an error occurr,please try again later '))
        }
    } catch (e) {
        return res.status(500)
    }
};

exports.listPlan = async (req, res, next) => {
    try {
        const find_plan = await planModel.find({});
        if (!find_plan) {
            return res.status(400)
                .json(vm.ApiResponse(true, 400, 'Oops! an error occur'))
        } else {
            return res.status(200)
                .json(vm.ApiResponse(true, 200, 'Success', find_plan))
        }
    } catch (e) {
        return res.status(500)
    }
}
