// utils/resume-preview.js
/**
 * 简历预览图生成工具
 * 使用 Canvas 根据简历内容动态生成缩略图
 */

/**
 * 生成简历预览图
 * @param {Object} resumeData - 简历数据
 * @param {Object} canvas - Canvas 实例
 * @returns {Promise<string>} - 返回临时图片路径
 */
function generateResumePreview(resumeData, canvas) {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas 实例不存在'));
      return;
    }

    const ctx = canvas.getContext('2d');

    // 设置画布尺寸（按比例缩小，提高性能）
    const width = 300;  // 实际显示时会缩放
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // 绘制背景
    drawBackground(ctx, width, height);

    // 绘制简历内容
    drawResumeContent(ctx, resumeData, width, height);

    // 导出为临时图片
    wx.canvasToTempFilePath({
      canvas: canvas,
      success: (res) => {
        resolve(res.tempFilePath);
      },
      fail: (err) => {
        console.error('生成预览图失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 绘制背景
 */
function drawBackground(ctx, width, height) {
  // 白色背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // 顶部装饰色块
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#2DD4BF');
  gradient.addColorStop(1, '#0FB9A6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, 80);
}

/**
 * 绘制简历内容
 */
function drawResumeContent(ctx, data, width, height) {
  const padding = 20;
  let currentY = padding + 10;

  // 设置字体
  ctx.textBaseline = 'top';

  // 1. 绘制姓名（白色，顶部彩色区域）
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(data.name || '未命名', padding, currentY);
  currentY += 30;

  // 2. 绘制职位（白色）
  ctx.font = '16px sans-serif';
  ctx.fillText(data.position || '职位未设置', padding, currentY);
  currentY = 90; // 跳过彩色区域

  // 3. 绘制联系方式
  ctx.fillStyle = '#6B7787';
  ctx.font = '12px sans-serif';
  const contact = [];
  if (data.phone) contact.push(data.phone);
  if (data.email) contact.push(data.email);
  if (contact.length > 0) {
    ctx.fillText(contact.join(' | '), padding, currentY);
    currentY += 20;
  }

  // 4. 绘制分隔线
  currentY += 5;
  ctx.strokeStyle = '#E6FBF7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, currentY);
  ctx.lineTo(width - padding, currentY);
  ctx.stroke();
  currentY += 15;

  // 5. 绘制教育经历（如果有）
  if (data.education && data.education.length > 0) {
    const edu = data.education[0];

    // 标题
    ctx.fillStyle = '#1E3240';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('教育背景', padding, currentY);
    currentY += 20;

    // 学校
    ctx.fillStyle = '#1E3240';
    ctx.font = '12px sans-serif';
    const schoolText = truncateText(ctx, edu.school || '学校名称', width - padding * 2);
    ctx.fillText(schoolText, padding, currentY);
    currentY += 18;

    // 专业
    ctx.fillStyle = '#6B7787';
    ctx.font = '11px sans-serif';
    const majorText = truncateText(ctx, `${edu.major || '专业'} · ${edu.degree || '学历'}`, width - padding * 2);
    ctx.fillText(majorText, padding, currentY);
    currentY += 25;
  }

  // 6. 绘制工作经历（如果有）
  if (data.experience && data.experience.length > 0) {
    const exp = data.experience[0];

    // 标题
    ctx.fillStyle = '#1E3240';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('工作经历', padding, currentY);
    currentY += 20;

    // 公司
    ctx.fillStyle = '#1E3240';
    ctx.font = '12px sans-serif';
    const companyText = truncateText(ctx, exp.company || '公司名称', width - padding * 2);
    ctx.fillText(companyText, padding, currentY);
    currentY += 18;

    // 职位
    ctx.fillStyle = '#6B7787';
    ctx.font = '11px sans-serif';
    const positionText = truncateText(ctx, exp.position || '职位', width - padding * 2);
    ctx.fillText(positionText, padding, currentY);
    currentY += 18;

    // 工作描述（简短）
    if (exp.description && currentY < height - 60) {
      ctx.fillStyle = '#8F9BA8';
      ctx.font = '10px sans-serif';
      const descLines = wrapText(ctx, exp.description, width - padding * 2, 2);
      descLines.forEach(line => {
        if (currentY < height - 40) {
          ctx.fillText(line, padding, currentY);
          currentY += 14;
        }
      });
    }
  }

  // 7. 绘制技能（如果有且还有空间）
  if (data.skills && data.skills.length > 0 && currentY < height - 40) {
    currentY += 10;

    // 标题
    ctx.fillStyle = '#1E3240';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('技能特长', padding, currentY);
    currentY += 20;

    // 技能标签
    ctx.fillStyle = '#0FB9A6';
    ctx.font = '10px sans-serif';
    const skills = data.skills.slice(0, 4).map(s => s.name).join(' · ');
    const skillsText = truncateText(ctx, skills, width - padding * 2);
    ctx.fillText(skillsText, padding, currentY);
  }
}

/**
 * 截断文本（避免超出）
 */
function truncateText(ctx, text, maxWidth) {
  const metrics = ctx.measureText(text);
  if (metrics.width <= maxWidth) {
    return text;
  }

  let truncated = text;
  while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

/**
 * 文本换行
 */
function wrapText(ctx, text, maxWidth, maxLines = 2) {
  const words = text.split('');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length && lines.length < maxLines; i++) {
    const testLine = currentLine + words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine !== '' && lines.length < maxLines) {
    lines.push(currentLine);
  }

  // 如果最后一行被截断，加省略号
  if (lines.length === maxLines && currentLine !== '') {
    lines[lines.length - 1] = truncateText(ctx, lines[lines.length - 1], maxWidth);
  }

  return lines;
}

/**
 * 批量生成简历预览图
 * @param {Array} resumeList - 简历列表
 * @returns {Promise<Array>} - 返回带预览图路径的简历列表
 */
async function generateBatchPreviews(resumeList) {
  const query = wx.createSelectorQuery();

  return new Promise((resolve) => {
    query.select('#preview-canvas')
      .fields({ node: true, size: true })
      .exec(async (res) => {
        if (!res[0] || !res[0].node) {
          console.warn('Canvas 节点不存在，使用占位图');
          resolve(resumeList);
          return;
        }

        const canvas = res[0].node;
        const updatedList = [];

        for (let resume of resumeList) {
          try {
            const preview = await generateResumePreview(resume, canvas);
            updatedList.push({
              ...resume,
              preview: preview
            });
          } catch (err) {
            console.error('生成预览图失败:', err);
            updatedList.push(resume);
          }
        }

        resolve(updatedList);
      });
  });
}

module.exports = {
  generateResumePreview,
  generateBatchPreviews
};
