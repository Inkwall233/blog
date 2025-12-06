const { execSync } = require('child_process')
const fs = require('fs')

// 配置目标仓库信息
const TARGET_REPO =
  process.env.TARGET_REPO || 'https://github.com/username/repository.git'
const DEPLOY_BRANCH = process.env.DEPLOY_BRANCH || 'main'

console.log('开始构建项目...')
execSync('npm run docs:build', { stdio: 'inherit' })

console.log('创建临时部署目录...')
if (fs.existsSync('temp-deploy')) {
  fs.rmSync('temp-deploy', { recursive: true })
}
fs.mkdirSync('temp-deploy')
process.chdir('temp-deploy')

console.log('初始化Git仓库...')
execSync('git init', { stdio: 'inherit' })
execSync(`git checkout -b ${DEPLOY_BRANCH}`, { stdio: 'inherit' })

console.log('复制构建产物...')
execSync('xcopy ..\\.vitepress\\dist . /E /I /Y', { stdio: 'inherit' })

console.log('提交到Git...')
execSync('git add .', { stdio: 'inherit' })
execSync('git commit -m "Deploy new version"', { stdio: 'inherit' })

console.log('推送到目标仓库...')
execSync(`git remote add origin ${TARGET_REPO}`, { stdio: 'inherit' })
execSync('git push -u --force origin ' + DEPLOY_BRANCH, { stdio: 'inherit' })

console.log('清理...')
process.chdir('..')
fs.rmSync('temp-deploy', { recursive: true })

console.log('部署完成！')
