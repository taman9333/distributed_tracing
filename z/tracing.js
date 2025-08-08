const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ParentBasedSampler, TraceIdRatioBasedSampler } = require('@opentelemetry/sdk-trace-base');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { trace } = require('@opentelemetry/api');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const exporter = new OTLPTraceExporter({ url: 'http://localhost:4318/v1/traces' })

const provider = new NodeTracerProvider({
  resource: new resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "service-z",
  }),
  spanProcessors: [new SimpleSpanProcessor(exporter)],
  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(0.3),
  })
});
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    // Express instrumentation expects HTTP layer to be instrumented
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});

// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
provider.register();

trace.getTracer("service-z");
