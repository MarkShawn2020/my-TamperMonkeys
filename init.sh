project_name=$1

source_dir='/Users/mark/mark_keeps_learning/core/softwares/TamperMonkey/douban-filter-houses'

cd $source_dir || exit

project_path=../$project_name
mkdir "$project_path"

cp metadata.js package.json tsconfig.json webpack.config.js "$project_path"

cd "$project_path" || exit

npm i

touch index.tsx
