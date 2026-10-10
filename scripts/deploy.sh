#!/bin/sh
# Versión 2: compila y publica dist/ en la rama gh-pages del repo MonterraSolutions/floreria-la-silla-v2.
# Es otro repo, así que la versión 1 (MonterraSolutions/floreria-la-silla) no se toca.
set -e
npm run build
cd dist
touch .nojekyll
git init -q -b gh-pages
git add -A
git commit -q -m "Publicar versión 2"
git push -q -f https://github.com/MonterraSolutions/floreria-la-silla-v2.git gh-pages
rm -rf .git
echo "Publicado: https://monterrasolutions.github.io/floreria-la-silla-v2/"
