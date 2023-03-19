#!/usr/bin/env ts-node

import * as process from "process";
import {promises as fs} from "fs";
import path from "path";

// process.argv: ["npx", "m-tms", "init-project", "projectName", "targetUrl"]
const projectName = process.argv[3]
const targetUrl = process.argv[4]

const rootProjectDir = '/Users/mark/my-coding/my-TamperMonkeys'
const mirrorProjectDir = path.join(rootProjectDir, "project-sample")
console.log({rootProjectDir, mirrorProjectDir})

const initProject = async (projectName: string, targetUrl: string): Promise<string> => {
  const targetProjectDir = path.join(rootProjectDir, projectName)
  console.log({projectName, targetProjectDir})
  await fs.mkdir(targetProjectDir);
  await fs.cp(mirrorProjectDir, targetProjectDir, {recursive: true})

  for (let fnToRewrite of ['metadata.js']) {
    const fpToRewrite = path.join(targetProjectDir, fnToRewrite)
    console.log(`rewriting file://${fpToRewrite}`)
    const sRaw = await fs.readFile(fpToRewrite, {encoding: 'utf-8'})
    console.log(`read file://${fpToRewrite}`)
    const sEval = eval('`' + sRaw + '`')
    console.log({sRaw, sEval})
    await fs.writeFile(fpToRewrite, sEval, {encoding: 'utf-8'})
    console.log(`rewrote file://${fpToRewrite}`)
  }

  return targetProjectDir
}

initProject(projectName, targetUrl)
  .then((targetProjectPath) => {
    console.log(`initiated project at: ${targetProjectPath}`)
  })
