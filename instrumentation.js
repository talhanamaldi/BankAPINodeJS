const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-proto");

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://10.150.238.177:4318/v1/traces",
    serviceName: "nodeJSAPI",
  }),

  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
