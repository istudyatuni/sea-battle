#!/bin/sh
# variables
deploy_source_branch="web"
deploy_remote="deploy"
gh_pages="gh-pages"

# colorize some output
ORANGE="\033[0;33m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

# checking where the script starts from
dir=${PWD##*/}
if [ $dir != "sea-battle" ]; then
  echo "Make sure then you run this script from sea-battle/ directory"
  dir=`pwd`
  echo -e "Now directory is $dir"
  exit
fi

echo -e "${CYAN}Better, if you will run it from branch \"$deploy_source_branch\"$NC"
echo -e "If not, check for unsaved changes\n"

# checking for correct "homepage" key in package.json
echo -n "cat:"
cat web/package.json | grep homepage
answer=y
read -p "Did you change \"homepage\" in package.json? [y,n]:" answer
case $answer in
  y) echo "Good";;
  n) echo "This file is located at web/package.json"
    exit;;
  *) echo "Oops"
    exit;;
esac

# checking out source branch
echo -e "\n${ORANGE}git checkout $deploy_source_branch$NC"
git checkout $deploy_source_branch
cd web

# building
echo -e "\n${ORANGE}npm run deploy$NC"
npm run deploy
read -p "Check for unsaved changes in working directory (after it tap enter)"

# pulling
git checkout $gh_pages
echo -e "\n${ORANGE}git pull origin $gh_pages$NC"
git pull origin $gh_pages

# pushing to deploy
echo -e "\n${ORANGE}git push $deploy_remote $gh_pages$NC"
git push $deploy_remote $gh_pages

# returning
echo -e "\n${ORANGE}git checkout $deploy_source_branch$NC"
git checkout $deploy_source_branch
