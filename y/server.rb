require 'sinatra'
require 'net/http'

get '/y' do
  response = Net::HTTP.get(URI('http://localhost:3002/z'))
  "Service Y received: #{response}"
end

set :port, 3001
puts 'Service Y listening on port 3001'
