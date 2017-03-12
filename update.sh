#!/bin/sh

cd ~/.vim_runtime && git pull --rebase && cd -
brew upgrade
npm update -g
npm update
