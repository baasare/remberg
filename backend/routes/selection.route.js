module.exports = app => {
    const selections = require("../controllers/selection.controller.js");

    const router = require("express").Router();

    // GET All Selected Products
    router.get('/', selections.getSelections);

    // CREATE Selected Product
    router.post('/', selections.saveSelection);

    // DELETE Selected Product
    router.delete('/:id', selections.deleteSelection);

    app.use('/api/v1/selection', router);
}
