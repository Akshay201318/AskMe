const httpStatus = require("http-status");
const { openai } = require("../services/chatgpt.service");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");


const getResponse = catchAsync(async (req, res) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.text,
        stream: false,
        max_tokens: 4000
      });
    if (!completion) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Sorry not found');
    }
    const result = completion.data.choices
    res.send(result);
});

module.exports = {
    getResponse
}