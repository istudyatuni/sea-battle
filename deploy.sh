#!/bin/sh
# variables
deploy_source_branch="web"
deploy_remote="deploy"
gh_pages="gh-pages"

# checking where the script starts from
dir=${PWD##*/}
if [ $dir != "sea-battle" ]; then
  echo "Make sure then you run this script from sea-battle/ directory"
  dir=`pwd`
  echo -e "Now directory is $dir"
  exit
fi

# checking for correct "homepage" key in package.json
echo -n "cat:"
cat web/package.json | grep homepage
answer=y
read -p "Did you change 'homepage' in package.json? [y,n]:" answer
case $answer in
  y) echo "Good";;
  n) cat web/package.json | grep homepage
    echo "This file is located at web/package.json"
    exit;;
  *) echo "Oops"
    exit;;
esac

# checking out source branch
git checkout $deploy_source_branch
cd web

# building
npm run deploy
read -p "Check for unsaved changes in working directory (after it tap enter)"

# pulling
git checkout $gh_pages
echo "Pulling origin $gh_pages"
git pull origin $gh_pages

# pushing to deploy
echo "git push $deploy_remote $gh_pages"
git push $deploy_remote $gh_pages

# returning
git checkout $deploy_source_branch
