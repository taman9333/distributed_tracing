require 'sinatra'
require 'faraday'

require 'opentelemetry/sdk'
require 'opentelemetry/exporter/otlp'
require 'opentelemetry/instrumentation/sinatra'
require 'opentelemetry/instrumentation/faraday'

OpenTelemetry::SDK.configure do |c|
  c.service_name = 'service-y'
  c.use 'OpenTelemetry::Instrumentation::Sinatra'
  c.use 'OpenTelemetry::Instrumentation::Faraday'
end

OpenTelemetry.tracer_provider.sampler = OpenTelemetry::SDK::Trace::Samplers::TraceIdRatioBased.new(0.3)

get '/y' do
  conn = ::Faraday.new('http://localhost:3002')
  res = conn.get('/z')
  if res.status >= 400
    span = OpenTelemetry::Trace.current_span
    span.status = OpenTelemetry::Trace::Status.error
    span.add_event(
      "Z failed with #{res.status}",
      attributes: {
        'http.status_code' => res.status,
        'response.body' => res.body
      }
    )
  end
  "Service Y received: #{res.body}"
end

set :port, 3001
puts 'Service Y listening on port 3001'
