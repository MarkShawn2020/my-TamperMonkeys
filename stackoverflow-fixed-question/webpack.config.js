const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin')

const projectName = path.basename(__dirname)

function dropRequireLocalFile(s) {
    var lines = ""
    s.split("\n")
        .forEach(line => {
            if (/\/\/\s*@require\s+file:/.test(line)) {
                console.log("detected line of requiring local file: ", line)
            } else {
                lines += line + "\n"
            }
        })
    return lines
}


function getVersion(s) {
    for (let line of s.split("\n")) {
        if (/\/\/\s*@version/.test(line)) {
            const version = line.match(/[\d\.]+/)[0]
            console.log("detected version: ", version)
            return version
        }
    }
}


module.exports = {
    entry: './index.tsx',
    mode: "production",
    watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        //   实现编译后自动输出一个分发文件, ref: https://stackoverflow.com/a/49786887/9422455
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    const strMetaData = fs.readFileSync('./metadata.js', { encoding: 'utf-8' })
                    const strBundled = fs.readFileSync('./dist/bundle.js', { encoding: 'utf-8' })

                    fs.writeFile(
                        "./dist/" + "TamperMonkey_" + projectName + "_" + getVersion(strMetaData) + ".js",
                        dropRequireLocalFile(strMetaData) + '\n' + strBundled,
                        (err) => { if (err) throw new Error(err) })

                })
            }
        },
        // 实现指定文件的监听，ref: https://stackoverflow.com/a/66960930/9422455, https://webpack.js.org/configuration/watch/
        new WatchExternalFilesPlugin.default({
            files: [
                './metadata.js'
            ]
        })
    ]
};