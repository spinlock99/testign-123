#!/usr/bin/env bash
echo "executing script"
name=$1
file_name=$2
handle=$3
username=$4
token=$5

cd /tmp/todo-pwa/
git checkout template
git pull
git checkout -B $file_name
for file in manifest.json src/index.ejs webpack.dev.js webpack.prod.js
do
  echo "migrating $file"
  sed \
    -i.backup \
    -e "s|NAME|$name|" \
    -e "s|ICON|https://process.filestackapi.com/resize=width:144/$handle|" $file
  rm $file.backup
  git add $file
done
git commit -m "updated icon"
git push -f "https://$username:$token@github.com/$username/$file_name.git" $file_name:master
git checkout template
