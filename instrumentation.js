const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-proto");
const { Resource } = require('@opentelemetry/resources');
const {
  SEMRESATTRS_SERVICE_NAME,
} = require('@opentelemetry/semantic-conventions');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://10.150.238.132:4318/v1/traces",
    serviceName: "nodeJSAPI",
  }),

  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'nodejs_bank_api',
  }),
});


sdk.start();
