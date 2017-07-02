#!/usr/bin/env bash
echo "executing script"
name=$1
file_name=$2
handle=$3
token=$4

cd /tmp/todo-pwa/
git co template
git pull
git co -B $file_name
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
git push -f "https://spinlock99:$token@github.com/spinlock99/$file_name.git" $file_name:master
git co template
