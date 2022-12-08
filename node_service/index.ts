// import {ROOT_CONTEXT} from "@opentelemetry/api";
// import opentelemetry from "@opentelemetry/api";
const { trace, context, SpanStatusCode, propagation } = require("@opentelemetry/api");
const { W3CTraceContextPropagator } = require("@opentelemetry/core");
import fetch from 'node-fetch';

const express = require('express');
const app = express();
const port = 4000;

/* Set Global Propagator */
// propagation.setGlobalPropagator(new W3CTraceContextPropagator());

app.get('/metrics', (request, res) => {
    const tracer = trace.getTracer("my-application", "0.1.0");
    console.log(request.headers)
    let activeContext = propagation.extract(request.headers)
    const span = tracer.startSpan('handleRequest');
    context.with(trace.setSpan(activeContext, span), () => {
      fetch('http://127.0.0.1:7000/gateway')
      res.send("value")
      console.log("existing")
      span.end();
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})