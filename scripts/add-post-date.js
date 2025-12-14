const fs = require('fs');
const path = require('path');

// 获取命令行参数
const filePath = process.argv[2];

if (!filePath) {
  console.error('请提供文件路径作为参数');
  process.exit(1);
}

const fullPath = path.resolve(filePath);

if (!fs.existsSync(fullPath)) {
  console.error(`文件不存在: ${fullPath}`);
  process.exit(1);
}

// 读取文件内容
let content = fs.readFileSync(fullPath, 'utf-8');

// 如果已经有 frontmatter，则添加日期
if (content.startsWith('---')) {
  // 找到结束的 ---
  const lines = content.split('\n');
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex !== -1) {
    // 提取文件名中的日期（假设格式为 YYYYMMDD）
    const fileName = path.basename(filePath, '.md');
    const dateMatch = fileName.match(/^(\d{4})(\d{2})(\d{2})/);
    
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      const formattedDate = `${year}-${month}-${day}`;
      
      // 检查是否已有 date 字段
      let hasDate = false;
      for (let i = 1; i < endIndex; i++) {
        if (lines[i].startsWith('date:')) {
          hasDate = true;
          break;
        }
      }
      
      // 如果没有 date 字段，则添加
      if (!hasDate) {
        lines.splice(endIndex, 0, `date: ${formattedDate}`);
        content = lines.join('\n');
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`已为文件 ${filePath} 添加日期: ${formattedDate}`);
      } else {
        console.log(`文件 ${filePath} 已有日期字段`);
      }
    }
  }
} else {
  // 如果没有 frontmatter，创建一个新的
  const fileName = path.basename(filePath, '.md');
  const dateMatch = fileName.match(/^(\d{4})(\d{2})(\d{2})/);
  
  if (dateMatch) {
    const [, year, month, day] = dateMatch;
    const formattedDate = `${year}-${month}-${day}`;
    
    const newContent = `---
date: ${formattedDate}
---

${content}`;
    
    fs.writeFileSync(fullPath, newContent, 'utf-8');
    console.log(`已为文件 ${filePath} 创建 frontmatter 并添加日期: ${formattedDate}`);
  }
}