#!/bin/sh

echo "gh-pages uninstalled" && exit 1

# variables
deploy_source_branch="dev"
deploy_remote="origin"
gh_pages="gh-pages"

# colorize some output
RED="\033[0;31m"
ORANGE="\033[0;33m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

# checking where the script starts from
dir=${PWD##*/}
if [ $dir != "sea-battle" ]; then
  echo -e "${RED}Make sure you run this script from ${ORANGE}sea-battle ${RED}directory$NC"
  echo -e "Now directory is $ORANGE$(pwd)$NC"
  exit
fi

current_branch=`git branch --show-current`

if [ $current_branch != $deploy_source_branch ]; then
  echo -e "\n${BLUE}Better, if you will run it from branch \"$deploy_source_branch\"$NC"
  echo -e "${BLUE}Do not forget check for unsaved changes$NC\n"
fi

# checking for correct "homepage" key in package.json
echo -n "cat:"
cat web/package.json | grep homepage

echo -en "Did you change ${ORANGE}\"homepage\"${NC} in package.json? "
read -p "[y,n]:" answer
case $answer in
  y) echo "Good";;
  n) echo "This file is located at web/package.json"
    exit;;
  *) echo "Oops"
    exit;;
esac

if [ $current_branch != $deploy_source_branch ]; then
  echo -e "\n${ORANGE}git stash save 'save working directory before deploy'$NC"
  git stash save 'save working directory before deploy'
  echo -e "\n${ORANGE}git stash apply$NC"
  git stash apply

  # checking out source branch
  echo -e "\n${ORANGE}git checkout $deploy_source_branch$NC"
  git checkout $deploy_source_branch
fi

cd web

# building
echo -e "\n${ORANGE}npm run deploy$NC"
npm run deploy

# fetching
echo -e "\n${ORANGE}git fetch origin $gh_pages:$gh_pages$NC"
git fetch origin $gh_pages:$gh_pages

# pushing to deploy
echo -e "\n${ORANGE}git push $deploy_remote $gh_pages$NC"
git push $deploy_remote $gh_pages
