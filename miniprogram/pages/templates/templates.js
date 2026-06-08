// pages/templates/templates.js
Page({
  data: {
    activeCategory: 'all',
    filteredTemplates: [],
    templates: [
      {
        id: 1,
        name: '清新简约',
        category: '通用',
        categoryKey: 'general',
        vip: false,
        hot: true,
        bgColor: 'linear-gradient(160deg, #E6FBF7, #C9F3EC)',
        accent: '#0FB9A6',
        layout: 'clean',
        sample: {
          name: '林思禾',
          role: '产品经理',
          summary: '3 年互联网产品经验，擅长增长策略与用户体验优化。',
          contact: '上海 · 138****6688 · mia@mail.com',
          sections: [
            {
              title: '项目经历',
              items: ['负责简历编辑器改版，上线后模板使用率提升 28%', '搭建用户反馈闭环，核心问题响应时间缩短 40%']
            },
            {
              title: '核心能力',
              items: ['需求分析 · 数据看板 · A/B 测试 · 原型设计']
            }
          ]
        }
      },
      {
        id: 2,
        name: '活力橙调',
        category: '设计',
        categoryKey: 'design',
        vip: true,
        hot: false,
        bgColor: 'linear-gradient(160deg, #FFF1E9, #FFE0D2)',
        accent: '#F97316',
        layout: 'sidebar',
        sample: {
          name: '陈一然',
          role: '视觉设计师',
          summary: '关注品牌视觉与界面细节，具备从概念到交付的完整经验。',
          contact: '杭州 · Portfolio',
          sections: [
            {
              title: '代表作品',
              items: ['主导招聘平台品牌升级，完成 30+ 页面视觉规范', '设计活动主视觉，带动报名转化提升 19%']
            },
            {
              title: '工具',
              items: ['Figma · Photoshop · Illustrator · C4D']
            }
          ]
        }
      },
      {
        id: 3,
        name: '商务蓝调',
        category: '求职',
        categoryKey: 'business',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #EAF0FF, #D5E2FF)',
        accent: '#2563EB',
        layout: 'business',
        sample: {
          name: '周明睿',
          role: '销售经理',
          summary: '5 年 B2B 销售经验，擅长大客户开拓、线索管理与团队协同。',
          contact: '北京 · 目标岗位：大客户经理',
          sections: [
            {
              title: '工作成果',
              items: ['年度签约额 820 万，连续 4 个季度达成率超过 120%', '建立行业客户名单，新增 46 个有效商机']
            },
            {
              title: '优势',
              items: ['商务谈判 · CRM 管理 · 渠道拓展']
            }
          ]
        }
      },
      {
        id: 4,
        name: '紫调创意',
        category: '运营',
        categoryKey: 'internet',
        vip: true,
        hot: false,
        bgColor: 'linear-gradient(160deg, #F3ECFF, #E5D9FF)',
        accent: '#7C3AED',
        layout: 'creative',
        sample: {
          name: '许安宁',
          role: '内容运营',
          summary: '擅长选题策划、社群增长和活动转化，能独立推进内容项目。',
          contact: '广州 · 新媒体 / 社群',
          sections: [
            {
              title: '运营案例',
              items: ['策划 12 期专题内容，单月阅读量提升至 18 万', '搭建社群 SOP，留存率从 43% 提升到 61%']
            },
            {
              title: '关键词',
              items: ['增长 · 内容策略 · 活动策划 · 数据复盘']
            }
          ]
        }
      },
      {
        id: 5,
        name: '极简黑白',
        category: '通用',
        categoryKey: 'general',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #F8F9FA, #E9ECEF)',
        accent: '#111827',
        layout: 'minimal',
        sample: {
          name: '梁予川',
          role: '前端工程师',
          summary: '熟悉小程序与 Web 前端开发，重视组件质量和性能体验。',
          contact: '深圳 · GitHub · 3 年经验',
          sections: [
            {
              title: '项目',
              items: ['重构订单模块，首屏加载时间减少 35%', '封装 20+ 业务组件，提升团队交付效率']
            },
            {
              title: '技术栈',
              items: ['JavaScript · Vue · 小程序 · Node.js']
            }
          ]
        }
      },
      {
        id: 6,
        name: '活力青春',
        category: '校招',
        categoryKey: 'campus',
        vip: false,
        hot: true,
        bgColor: 'linear-gradient(160deg, #FFF5E6, #FFE8CC)',
        accent: '#EA580C',
        layout: 'campus',
        sample: {
          name: '苏清越',
          role: '市场实习生',
          summary: '新闻传播专业，参与校园活动策划与社媒内容运营。',
          contact: '南京 · 2027 届 · 可实习 4 天/周',
          sections: [
            {
              title: '校园经历',
              items: ['负责迎新活动宣传，触达 3000+ 新生', '运营学院公众号，月均发布 16 篇内容']
            },
            {
              title: '能力',
              items: ['文案 · 活动执行 · 基础数据分析']
            }
          ]
        }
      },
      {
        id: 7,
        name: '数据理性',
        category: '互联网',
        categoryKey: 'internet',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #EAF8FF, #D7EEFF)',
        accent: '#0284C7',
        layout: 'business',
        sample: {
          name: '顾南星',
          role: '数据分析师',
          summary: '熟悉 SQL 与业务指标体系，能从数据发现增长机会并推动落地。',
          contact: '上海 · SQL / Python · 2 年经验',
          sections: [
            {
              title: '分析项目',
              items: ['搭建用户留存看板，定位 3 个关键流失节点', '完成转化漏斗分析，推动注册转化率提升 16%']
            },
            {
              title: '技能',
              items: ['SQL · Python · Tableau · 指标体系']
            }
          ]
        }
      },
      {
        id: 8,
        name: '品牌策划',
        category: '设计',
        categoryKey: 'design',
        vip: false,
        hot: true,
        bgColor: 'linear-gradient(160deg, #FFF0F4, #FFE0EA)',
        accent: '#E11D48',
        layout: 'creative',
        sample: {
          name: '宋知夏',
          role: '品牌策划',
          summary: '擅长品牌定位、整合传播与活动创意，关注从策略到视觉的一致表达。',
          contact: '成都 · 品牌 / 活动 / 内容',
          sections: [
            {
              title: '品牌案例',
              items: ['参与新品上市传播，活动曝光量达到 120 万', '梳理品牌话术体系，统一官网与销售物料表达']
            },
            {
              title: '能力',
              items: ['用户洞察 · Campaign · 文案 · 视觉协同']
            }
          ]
        }
      },
      {
        id: 9,
        name: '咨询精英',
        category: '商务',
        categoryKey: 'business',
        vip: true,
        hot: false,
        bgColor: 'linear-gradient(160deg, #EEF2FF, #DDE6FF)',
        accent: '#4F46E5',
        layout: 'minimal',
        sample: {
          name: '韩景行',
          role: '战略咨询顾问',
          summary: '具备行业研究、访谈分析和商业建模经验，能输出高质量方案。',
          contact: '北京 · MBA · 英语流利',
          sections: [
            {
              title: '项目经验',
              items: ['完成新能源行业进入策略研究，覆盖 36 家标杆企业', '搭建财务测算模型，支持客户制定三年增长计划']
            },
            {
              title: '方法',
              items: ['桌面研究 · 专家访谈 · 财务模型 · PPT 叙事']
            }
          ]
        }
      },
      {
        id: 10,
        name: '人事暖调',
        category: '商务',
        categoryKey: 'business',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #FFF7ED, #FFEAD5)',
        accent: '#D97706',
        layout: 'sidebar',
        sample: {
          name: '沈若宁',
          role: 'HR 专员',
          summary: '熟悉招聘执行、员工关系和入离调转流程，沟通细致稳定。',
          contact: '苏州 · 人力资源 · 2 年经验',
          sections: [
            {
              title: '工作内容',
              items: ['独立跟进 20+ 岗位招聘，月均面试邀约 80 人次', '优化入职材料清单，新员工办理耗时减少 30%']
            },
            {
              title: '模块',
              items: ['招聘 · 员工关系 · 考勤 · 档案管理']
            }
          ]
        }
      },
      {
        id: 11,
        name: '财务稳健',
        category: '商务',
        categoryKey: 'business',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #ECFDF5, #D7F7E8)',
        accent: '#059669',
        layout: 'business',
        sample: {
          name: '陆嘉禾',
          role: '财务会计',
          summary: '熟悉费用审核、账务处理和报表编制，注重准确性与流程规范。',
          contact: '杭州 · 初级会计 · 3 年经验',
          sections: [
            {
              title: '工作成果',
              items: ['完成月度费用审核 600+ 笔，差错率低于 0.5%', '协助建立报销台账，付款周期缩短 2 天']
            },
            {
              title: '技能',
              items: ['金蝶 · Excel · 费用审核 · 税务申报']
            }
          ]
        }
      },
      {
        id: 12,
        name: '学术清朗',
        category: '校招',
        categoryKey: 'campus',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #F0FDFA, #DDF7F1)',
        accent: '#14B8A6',
        layout: 'clean',
        sample: {
          name: '叶书白',
          role: '算法实习生',
          summary: '计算机硕士在读，研究方向为推荐系统与自然语言处理。',
          contact: '武汉 · 2027 届硕士 · 每周 4 天',
          sections: [
            {
              title: '科研项目',
              items: ['复现序列推荐模型，在公开数据集上 Recall 提升 4.2%', '参与论文实验设计，负责数据清洗与消融实验']
            },
            {
              title: '技术',
              items: ['Python · PyTorch · 机器学习 · 推荐系统']
            }
          ]
        }
      },
      {
        id: 13,
        name: '客服运营',
        category: '运营',
        categoryKey: 'internet',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #F5F3FF, #EDE9FE)',
        accent: '#8B5CF6',
        layout: 'campus',
        sample: {
          name: '唐沐辰',
          role: '用户运营',
          summary: '擅长用户分层、客服 SOP 和问题沉淀，能提升满意度与复购率。',
          contact: '厦门 · 用户增长 / 服务体验',
          sections: [
            {
              title: '运营成果',
              items: ['整理 120 条高频问题，客服首响效率提升 25%', '设计召回话术，沉默用户回访转化率达到 12%']
            },
            {
              title: '关键词',
              items: ['SOP · 用户分层 · 回访 · 满意度']
            }
          ]
        }
      },
      {
        id: 14,
        name: '行政通勤',
        category: '通用',
        categoryKey: 'general',
        vip: true,
        hot: false,
        bgColor: 'linear-gradient(160deg, #F1F5F9, #E2E8F0)',
        accent: '#475569',
        layout: 'minimal',
        sample: {
          name: '马清和',
          role: '行政助理',
          summary: '做事有条理，熟悉办公室行政、会议支持和供应商沟通。',
          contact: '天津 · 行政 / 后勤 · 到岗快',
          sections: [
            {
              title: '工作经历',
              items: ['负责 80 人办公室日常采购与资产登记', '统筹会议室排期，保障 30+ 场跨部门会议']
            },
            {
              title: '能力',
              items: ['流程执行 · 物资管理 · 会议支持 · 沟通协调']
            }
          ]
        }
      }
    ]
  },

  onLoad() {
    this.updateFilteredTemplates();
  },

  // 切换分类
  handleCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    }, () => {
      this.updateFilteredTemplates();
    });
  },

  updateFilteredTemplates() {
    const { activeCategory, templates } = this.data;
    const filteredTemplates = activeCategory === 'all'
      ? templates
      : templates.filter(item => item.categoryKey === activeCategory);

    this.setData({ filteredTemplates });
  },

  // 点击模板
  handleTemplateClick(e) {
    const id = e.currentTarget.dataset.id;
    const template = this.data.templates.find(t => t.id === id);

    // 如果是VIP模板，检查会员状态
    if (template.vip) {
      wx.showModal({
        title: '会员专享',
        content: '该模板为会员专享，是否开通会员？',
        confirmText: '去开通',
        success: (res) => {
          if (res.confirm) {
            // TODO: 跳转到会员购买页
            console.log('跳转到会员页');
          }
        }
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/editor/editor?templateId=' + id
    });
  }
});
