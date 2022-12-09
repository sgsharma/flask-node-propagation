const { Resource } = require('@opentelemetry/resources');
const { BatchSpanProcessor } = require ("@opentelemetry/sdk-trace-base");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { ConsoleSpanExporter, NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require ('@opentelemetry/instrumentation-http');
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { ExpressInstrumentation } = require ('@opentelemetry/instrumentation-express');
const { FetchInstrumentation } = require ('@opentelemetry/instrumentation-fetch');
const { ZoneContextManager } = require ('@opentelemetry/context-zone');

// const { GraphQLInstrumentation } = require ('@opentelemetry/instrumentation-graphql');

const provider = new NodeTracerProvider({
  resource: Resource.default().merge(new Resource({
    "service.name": "test_node_service_1",
  })),
});

// Configure a test exporter to print all traces to the console
const exporter = new OTLPTraceExporter({
    url: "https://api.honeycomb.io/v1/traces",
    headers: {"x-honeycomb-team": process.env.HONEYCOMB_API_KEY},
    contextManager: new ZoneContextManager(),
});

provider.addSpanProcessor(
  new BatchSpanProcessor(exporter)
);

provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));

provider.register();

registerInstrumentations({
  instrumentations: [
    // new getNodeAutoInstrumentations(),
    new FetchInstrumentation(),
    new ExpressInstrumentation(),
    new HttpInstrumentation()
  ]
});
