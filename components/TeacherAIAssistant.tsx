'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/types'

// 模拟教师专用OpenAI API调用
const mockTeacherAICall = async (prompt: string, context: string): Promise<string> => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 根据教师需求生成针对性回复
  if (prompt.includes('课程设计') || prompt.includes('课程结构')) {
    return `关于课程设计，我建议你：

1. 明确课程目标和学习成果
2. 设计合理的模块结构，每个模块控制在2-3个任务
3. 确保内容由浅入深，循序渐进
4. 结合理论与实践，增加互动元素
5. 为每个任务设置清晰的评估标准

需要我帮你具体设计某个模块的结构吗？`
  } else if (prompt.includes('教学方法') || prompt.includes('教学策略')) {
    return `关于教学方法，我建议你：

1. 采用项目式学习，让学生在实践中学习
2. 结合科技馆资源，设计实地考察任务
3. 鼓励小组合作，培养团队协作能力
4. 使用多媒体资源增强学习体验
5. 定期进行形成性评估，及时调整教学策略

需要我针对某个具体主题提供更详细的教学建议吗？`
  } else if (prompt.includes('任务设计') || prompt.includes('作业设计')) {
    return `关于任务设计，我建议你：

1. 任务难度适中，既有挑战性又能完成
2. 提供明确的任务要求和评分标准
3. 设计多样化的任务形式，如调研报告、设计方案、实验报告等
4. 鼓励学生创新思维，允许不同的解决方案
5. 为任务提供必要的学习资源和参考资料

需要我帮你设计某个具体任务的详细要求吗？`
  } else if (prompt.includes('评估') || prompt.includes('评价')) {
    return `关于学习评估，我建议你：

1. 采用多元化的评估方式，包括过程性评估和总结性评估
2. 建立明确的评分标准和 rubric
3. 注重学生的学习过程和进步
4. 提供及时、具体的反馈
5. 鼓励学生进行自评和互评

需要我帮你设计评估表格或评分标准吗？`
  } else {
    return `我理解你的问题。作为教师课程开发助手，我可以帮助你：

1. 设计课程结构和模块
2. 制定教学方法和策略
3. 设计任务和评估标准
4. 提供教学资源和参考资料
5. 解决课程开发中的具体问题

请告诉我你具体需要哪方面的帮助？`
  }
}

interface TeacherAIAssistantProps {
  currentPage?: string
}

export default function TeacherAIAssistant({ currentPage = '' }: TeacherAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是你的AI课程开发助手。我可以帮助你设计课程结构、制定教学方法、设计任务和评估标准。有什么需要帮助的吗？',
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    '如何设计课程结构？',
    '有哪些有效的教学方法？',
    '如何设计任务和评估标准？',
    '如何提高学生参与度？',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')

    // 模拟AI回复
    try {
      const context = currentPage
      const aiResponse = await mockTeacherAICall(inputMessage, context)
      
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiReply])
    } catch (error) {
      console.error('AI response error:', error)
      const errorReply: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，我暂时无法回答你的问题，请稍后再试。',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorReply])
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  return (
    <div className="h-[200px] bg-white border-t border-slate-200 flex flex-col shrink-0">
      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${msg.type === 'ai' ? 'bg-gray-50 border border-gray-200' : 'bg-blue-100 text-blue-800'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 快捷问题 */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuickQuestion(question)}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs whitespace-nowrap hover:bg-blue-100 transition"
          >
            {question}
          </button>
        ))}
      </div>

      {/* 输入框 */}
      <div className="px-4 py-2 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="输入你的问题..."
          className="flex-1 px-3 py-2 border-2 border-blue-300 rounded-lg text-sm outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}