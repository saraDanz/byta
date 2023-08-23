const mongoose = require("mongoose");
const Variable = require("../models/variable").variableModel;


const getLastVariableByFieldName = async (req, res) => {
    try {
        const { name, key } = req.params;
        if (!name)
            return res.status(400).send("name is required!");
        if (!key)
            return res.status(400).send("key is required!");
        let variables = await Variable.find({ name, key }).sort({ "setDate": -1 });

        if (!variables.length)
            return res.status(404).send("no such variable!");
        return res.send(variables[0]);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}

const addNewVariable = async (req, res) => {
    try {
        let { valueType, key,
            value, name,
            setDate } = req.body;

        if (!key || !value || !name)
            return res.status(400).send("name, key and value are required fields!");


        let newVariable = new Variable({
            valueType, value, name, key,setDate:new Date()
        })

        await newVariable.save();
        return res.send(newVariable)

    }

    catch (e) {
        return res.status(400).send(e.message);


    }
}

const getVariables = async (req, res) => {
    try {


        let variables = await Variable.find().sort({ "setDate": -1 });
        //איך מביאים מכל סוג את האחרון


        return res.send(variables);
    }
    catch (e) {
        return res.status(400).send(e.message);

    }
}



module.exports = {

    addNewVariable, getLastVariableByFieldName, getVariables
}