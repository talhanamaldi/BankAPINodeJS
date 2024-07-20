const { context, trace } = require("@opentelemetry/api");

const addSpanAttribute = (req, res, next) => {
  res.addSpanData = (data,spanName) => {
    const currentSpan = trace.getSpan(context.active());
    if (currentSpan) {
      currentSpan.setAttribute(spanName, JSON.stringify(data));
    }
  };
  next();
};

module.exports = addSpanAttribute;