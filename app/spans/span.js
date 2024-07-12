const { context, trace } = require("@opentelemetry/api");

const addSpanAttribute = (req, res, next) => {
  res.addSpanData = (data) => {
    const currentSpan = trace.getSpan(context.active());
    if (currentSpan) {
      currentSpan.setAttribute('http.response.post', JSON.stringify(data));
    }
  };
  next();
};

module.exports = addSpanAttribute;