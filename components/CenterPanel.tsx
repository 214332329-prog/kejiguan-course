'use client'

import { useState, useRef, useEffect } from 'react'
import { Task, Module, Message } from '@/types'

interface CenterPanelProps {
  selectedTask?: Task | null
  currentModule?: Module | null
  user?: any
}

export default function CenterPanel({ selectedTask = null, currentModule, user }: CenterPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'task'>('content')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是你的AI学习助手。选择左侧任务后，我可以为你提供针对性的学习帮助。',
      timestamp: new Date().toISOString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [taskContent, setTaskContent] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    '调研报告怎么写？',
    '什么是用户画像？',
    '任务要求有哪些？',
    '优秀案例',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 当选择新任务时，重置提交状态
  useEffect(() => {
    setTaskContent('')
    setAttachments([])
    setSubmitSuccess(false)
    setActiveTab('content')
  }, [selectedTask?.id])

  const handleSendMessage = () => {
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
    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: selectedTask
          ? `关于"${selectedTask.title}"，我建议你可以从以下几个方面入手：\n\n1. 仔细阅读任务要求\n2. 参考右侧的提交标准\n3. 有需要随时问我`
          : '收到你的问题！我会尽快为你解答。',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiReply])
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitTask = async () => {
    if (!taskContent.trim() && attachments.length === 0) {
      alert('请输入任务内容或上传附件')
      return
    }

    setSubmitting(true)

    // 模拟提交过程
    setTimeout(() => {
      setSubmitting(false)
      setSubmitSuccess(true)
      // 3秒后重置成功状态
      setTimeout(() => setSubmitSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full min-w-0">
      {/* 学习中心 */}
      <div className="flex-[1.5] flex flex-col min-h-0 overflow-hidden">
        {selectedTask ? (
          <>
            {/* 课时标题栏 */}
            <div className="px-6 py-5 border-b border-slate-200">
              <div className="text-xs text-slate-500 mb-2">
                {currentModule?.title} · {selectedTask.title}
              </div>
              <h1 className="text-xl font-bold text-slate-800 mb-3">{selectedTask.title}</h1>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedTask.duration || '45分钟'}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  包含1个任务
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  128人已学习
                </span>
              </div>
            </div>

            {/* 内容切换标签 */}
            <div className="px-6 border-b border-slate-200">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === 'content'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  学习内容
                </button>
                <button
                  onClick={() => setActiveTab('task')}
                  className={`py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === 'task'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  任务提交
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {activeTab === 'content' ? (
                <div className="space-y-6">
                  {/* 学习任务 */}
                  <div className="bg-slate-50 rounded-xl p-5">
                    <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xs">📋</span>
                      学习任务
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedTask.content}
                    </p>
                  </div>

                  {/* 任务要求 */}
                  {selectedTask.requirements && selectedTask.requirements.length > 0 && (
                    <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                      <h3 className="text-base font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-lg flex items-center justify-center text-xs">✓</span>
                        任务要求
                      </h3>
                      <ul className="space-y-2">
                        {selectedTask.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                            <span className="w-5 h-5 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 学习资源 */}
                  {selectedTask.resources && selectedTask.resources.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xs">📚</span>
                        学习资源
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedTask.resources.map((resource) => (
                          <div
                            key={resource.id}
                            className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer transition"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {resource.type === 'pdf' && <span className="text-red-500 text-xs font-bold">PDF</span>}
                              {resource.type === 'doc' && <span className="text-blue-500 text-xs font-bold">DOC</span>}
                              {resource.type === 'video' && <span className="text-purple-500 text-xs font-bold">▶</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-700 truncate">{resource.name}</p>
                              <p className="text-xs text-slate-400">{resource.size}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 视频讲解 */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xs">▶</span>
                      视频讲解
                    </h3>
                    <div className="bg-slate-800 rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:bg-slate-700 transition">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 提交成功提示 */}
                  {submitSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-green-800">任务提交成功！</p>
                        <p className="text-sm text-green-600">老师批改后会通知你</p>
                      </div>
                    </div>
                  )}

                  {/* 任务提交表单 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">任务</span>
                      <h4 className="font-semibold text-slate-800">{selectedTask.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">
                      请根据学习内容，完成相应的任务提交。支持文字、图片、文档等多种格式。
                    </p>
                    
                    {/* 文本输入 */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
                      <textarea
                        value={taskContent}
                        onChange={(e) => setTaskContent(e.target.value)}
                        className="w-full h-40 resize-none border-none outline-none text-sm"
                        placeholder="请输入你的任务内容..."
                      />
                    </div>

                    {/* 附件列表 */}
                    {attachments.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-slate-400 hover:text-red-500 transition"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:border-blue-400 transition cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        添加附件
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleSubmitTask}
                        disabled={submitting}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            提交中...
                          </>
                        ) : (
                          '提交任务'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 课时导航 */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm hover:border-blue-400 hover:text-blue-600 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                上一课
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm hover:border-blue-400 hover:text-blue-600 transition">
                下一课
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p>请从左侧选择一个课时开始学习</p>
            </div>
          </div>
        )}
      </div>

      {/* AI助手 */}
      <div className="h-[200px] bg-white border-t border-slate-200 flex flex-col shrink-0">
        {/* 聊天区域 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-lg text-xs ${
                msg.type === 'ai' 
                  ? 'bg-gray-50 border border-gray-200' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 提示文字 */}
        <div className="px-4 py-1 text-xs text-gray-400">
          使用@question提问，@judge提交评审
        </div>

        {/* 输入框 */}
        <div className="px-4 py-2 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="输入消息..."
            className="flex-1 px-3 py-2 border-2 border-purple-300 rounded-lg text-sm outline-none focus:border-purple-500"
          />
          <button
            onClick={handleSendMessage}
            className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center hover:bg-purple-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
