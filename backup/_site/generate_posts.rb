require 'net/http'
require 'json'

url = 'http://localhost:3000/api/files'
uri = URI(url)
response = Net::HTTP.get(uri)
files = JSON.parse(response)

files.each do |file|
  # Buat halaman untuk setiap file
  File.open("_posts/#{file['title'].gsub(' ', '_').downcase}.md", "w") do |f|
    f.write <<-HEREDOC
---
title: #{file['title']}
description: #{file['description']}
tags: #{file['tags'].join(', ')}
url: #{file['url']}
type: #{file['type']}
---
    HEREDOC
  end
end
