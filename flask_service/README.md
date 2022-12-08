Python version -->
Python 3.10.0

steps:
1. pip install -r requirements.txt
2. run command: OTEL_EXPORTER_OTLP_ENDPOINT="https://api.honeycomb.io/" OTEL_EXPORTER_OTLP_HEADERS="x-honeycomb-team=<key>" OTEL_SERVICE_NAME="flask_service_1" python app.py

