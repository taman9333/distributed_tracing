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

get '/y' do
  conn = ::Faraday.new('http://localhost:3002')
  res = conn.get('/z')
  "Service Y received: #{res.body}"
end

set :port, 3001
puts 'Service Y listening on port 3001'
