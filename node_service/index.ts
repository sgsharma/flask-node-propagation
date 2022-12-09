import fetch from 'node-fetch';
const otel = require('@opentelemetry/api')
const express = require('express');
// const { trace, context, SpanStatusCode, propagation } = require("@opentelemetry/api");
const { W3CTraceContextPropagator } = require("@opentelemetry/core");

const app = express();
const port = 4000;
const tracer = otel.trace.getTracer("my-application", "0.1.0");

/* Set Global Propagator */
otel.propagation.setGlobalPropagator(new W3CTraceContextPropagator());

app.get('/metric', (request, res) => {
    // let activeContext = otel.propagation.extract(otel.context.active(), request.headers)
    otel.propagation.inject(otel.context.active(), request.headers);
    console.log(otel.context.active())
    let span = tracer.startSpan('spanName', {
      attributes: {}
    }, otel.context.active())
    otel.trace.setSpan(otel.context.active(), span)
    // otel.context.with(otel.context.active(), () => {
    //   fetch('http://127.0.0.1:7000/gateway')
    //   res.send("value")
    // });
    tracer.startActiveSpan('handleRequest', childspan => {
      fetch('http://127.0.0.1:7000/gateway')
      res.send("value")
      console.log("existing")
      childspan.end();
    });
    span.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
