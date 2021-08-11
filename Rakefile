task :deploy do |t|
  sh "git push"
  sh "rsync -auP --exclude-from='rsync-exclude.txt' . $OMNI_REMOTE"
end

task :default => [:deploy]
