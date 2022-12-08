from flask import Flask, request
from opentelemetry.instrumentation.flask import FlaskInstrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import ConsoleSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
import opentelemetry.sdk.trace.sampling as sampler_class
from opentelemetry import trace
import requests

NUMBER = 0
# OTEL_EXPORTER_OTLP_ENDPOINT="https://api.honeycomb.io/" OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=<>" OTEL_SERVICE_NAME="flask_service_1" python app.py

# sampler = sampler_class.TraceIdRatioBased(1)
# provider = TracerProvider(sampler=sampler)
provider = TracerProvider()
trace.set_tracer_provider(provider)
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
# tracer = trace.get_tracer(__name__)
 
app = Flask(__name__)
 
@app.route('/sample')
def sample():
    print(request.headers)
    global NUMBER
    NUMBER = NUMBER+1
    print(f'present number is {NUMBER}')
    # with tracer.start_as_current_span(f'custom_span {NUMBER}') as span:
    #     span.set_attribute('number.id', NUMBER)
    requests.get(f"http://127.0.0.1:6000/sample/{NUMBER}", headers={"GRGGR":"JHFGFG"})
    return f'Hello World {NUMBER}'


@app.route('/call')
def hello_world():
    requests.get("http://127.0.0.1:6000/health")
    return 'Hello World'

@app.route('/health')
def hello_world_get():
    requests.get("http://127.0.0.1:6000/health")
    return 'Hello World get'

@app.route('/google')
def google():
    requests.get("https://www.google.com")
    return 'Google'

@app.route('/metrics')
def metrics():
    requests.get("http://localhost:4000/metrics")
    return 'Google'

@app.route('/gateway')
def gateway():
    print(request.headers)
    return f'Hello World'
 
def request_hook(span, environ):
    if span and span.is_recording():
        request_header_dict = dict()
        for key in environ:
            if key.startswith('HTTP_'):
                request_header_dict[f"request.header.{key.lower()}"] = environ[key]
        span.set_attributes(request_header_dict)

def response_hook(span, status, response_headers):
    if span and span.is_recording():
        response_headers_dict = dict()
        if response_headers:
            for header_name, header_value in response_headers:
                if header_value:
                    response_headers_dict[f"response.header.{header_name.lower()}"] = header_value
        span.set_attributes(response_headers_dict)

if __name__ == '__main__':
    # FlaskInstrumentor().instrument_app(app)
    FlaskInstrumentor().instrument_app(app, request_hook=request_hook, response_hook=response_hook)
    RequestsInstrumentor().instrument()
    app.run(port=7000, debug=True)
