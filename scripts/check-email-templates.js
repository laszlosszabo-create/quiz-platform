#!/usr/bin/env node
// Scans email templates and validates required tokens usage.
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const REQUIRED_PURCHASE_TOKENS = ['{{product_name}}','{{ai_result}}','{{user_email}}']
const REQUIRED_QUIZ_TOKENS = ['{{percentage}}','{{ai_result}}','{{user_email}}']

function extractTokens(str){
  return Array.from(new Set((str.match(/\{\{[a-zA-Z0-9_\.]+\}\}/g)||[])))
}

async function main(){
  const dir = path.join(process.cwd(),'email-templates')
  if(!fs.existsSync(dir)){
    console.log('No email-templates directory, skipping.')
    return
  }
  const files = fs.readdirSync(dir).filter(f=>/\.(html|md)$/i.test(f))
  let exitCode = 0
  for(const file of files){
    const full = path.join(dir,file)
    const content = fs.readFileSync(full,'utf8')
    const tokens = extractTokens(content)
    const isPurchase = /purchase/i.test(file)
    const required = isPurchase?REQUIRED_PURCHASE_TOKENS:REQUIRED_QUIZ_TOKENS
    const missing = required.filter(t=>!tokens.includes(t))
    if(missing.length){
      console.warn('[MISSING]', file, '→', missing.join(', '))
      exitCode = 1
    } else {
      console.log('[OK]', file)
    }
  }
  process.exit(exitCode)
}
main().catch(e=>{console.error(e);process.exit(2)})
