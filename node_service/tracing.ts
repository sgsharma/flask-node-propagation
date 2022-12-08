import * as opentelemetry from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const startTracing = () => {
    const TracingEnabled = true;
    if (TracingEnabled) {
        const OtelEndpoint = "https://api.honeycomb.io/v1/traces"
        const OtelServiceName = "test_node_service_1";
        if (OtelEndpoint && OtelServiceName) {
            const headerDict = {"x-honeycomb-team": "<>"};
            // const contextManager = new AsyncHooksContextManager();
            // contextManager.enable();
            // api.context.setGlobalContextManager(contextManager);
            // console.log(api.context.active());
            const sdk = new opentelemetry.NodeSDK({
                traceExporter: new OTLPTraceExporter({
                    url: OtelEndpoint,
                    headers: headerDict,
                }),
                serviceName: OtelServiceName,
                instrumentations: getNodeAutoInstrumentations(),
                // contextManager: contextManager
            });
            sdk.start().then(() => {
                console.log('Tracing initialized');
            }).catch((error) => console.log(`Error initializing tracing: ${error}`));
        } else {
            console.log("Incomplete Config for Tracing Initialization")
        }
    }
};
// console.log(getNodeAutoInstrumentations())
startTracing();

export { startTracing };