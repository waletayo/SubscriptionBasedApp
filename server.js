const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const vm = require("v-response");
const mongoose = require("mongoose");

const DB = 'mongodb://localhost/subscriptionbased';


mongoose.connect((DB), {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
})
    .then(() => vm.log("connected to mongoDB", DB))
    .catch(err => vm.log("error mongodb", err));

app.listen(port, vm.log("listing on port", port));
