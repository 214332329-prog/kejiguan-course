'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Course, Module, Task } from '@/types'
import { courseService, moduleService, taskService } from '@/lib/database'

export default function CreateCoursePage() {
  const router = useRouter()
  
  const [course, setCourse] = useState<Course>({
    id: `course-${Date.now()}`,
    title: '',
    description: '',
    modules: [],
    totalDuration: '',
    totalTasks: 0
  })
  
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)

  // 处理课程信息更新
  const handleCourseUpdate = (field: keyof Course, value: string) => {
    setCourse(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 处理模块更新
  const handleModuleUpdate = (moduleId: string, field: keyof Module, value: string) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, [field]: value } : module
      )
    }))
  }

  // 处理任务更新
  const handleTaskUpdate = (moduleId: string, taskId: string, field: keyof Task, value: string | string[]) => {
    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              tasks: module.tasks.map(task =>
                task.id === taskId ? { ...task, [field]: value } : task
              )
            }
          : module
      )
    }))
  }

  // 添加新模块
  const handleAddModule = () => {
    const newModule: Module = {
      id: `module-${course.modules.length + 1}`,
      title: `新模块 ${course.modules.length + 1}`,
      description: '',
      tasks: []
    }
    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }))
    setActiveModuleId(newModule.id)
  }

  // 添加新任务
  const handleAddTask = (moduleId: string) => {
    const module = course.modules.find(m => m.id === moduleId)
    if (!module) return

    const newTask: Task = {
      id: `task-${module.tasks.length + 1}`,
      title: `新任务 ${module.tasks.length + 1}`,
      status: 'pending',
      duration: '30分钟'
    }

    setCourse(prev => ({
      ...prev,
      modules: prev.modules.map(m =>
        m.id === moduleId
          ? { ...m, tasks: [...m.tasks, newTask] }
          : m
      )
    }))
  }

  // 计算总任务数
  const calculateTotalTasks = () => {
    return course.modules.reduce((total, module) => total + module.tasks.length, 0)
  }

  // 保存课程
  const handleSaveCourse = async () => {
    const updatedCourse = {
      ...course,
      totalTasks: calculateTotalTasks()
    }
    
    // 保存课程到数据库
    const savedCourse = await courseService.createCourse({
      title: updatedCourse.title,
      description: updatedCourse.description,
      totalDuration: updatedCourse.totalDuration,
      totalTasks: updatedCourse.totalTasks
    })
    
    if (savedCourse) {
      // 保存模块
      for (const module of updatedCourse.modules) {
        const savedModule = await moduleService.createModule({
          course_id: savedCourse.id,
          title: module.title,
          description: module.description,
          icon: module.icon
        })
        
        if (savedModule) {
          // 保存任务
          for (const task of module.tasks) {
            await taskService.createTask({
              module_id: savedModule.id,
              title: task.title,
              status: task.status,
              duration: task.duration,
              content: task.content
            })
          }
        }
      }
      
      console.log('课程创建成功:', savedCourse)
      router.push('/teacher/dashboard')
    } else {
      console.error('课程创建失败')
      alert('课程创建失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">教师课程开发中心</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/teacher/dashboard')}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-4"
              >
                返回
              </button>
              <button
                onClick={handleSaveCourse}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                创建课程
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 侧边导航 */}
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm">
          <nav className="mt-5 px-2 space-y-1">
            <a
              href="/teacher/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              课程管理
            </a>
            <a
              href="/teacher/analytics"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              数据分析
            </a>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* 页面标题 */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">创建新课程</h2>

            {/* 课程基本信息 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">课程基本信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">课程标题</label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => handleCourseUpdate('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入课程标题"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">总时长</label>
                  <input
                    type="text"
                    value={course.totalDuration}
                    onChange={(e) => handleCourseUpdate('totalDuration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如: 3小时"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">课程描述</label>
                  <textarea
                    value={course.description}
                    onChange={(e) => handleCourseUpdate('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入课程描述"
                  />
                </div>
              </div>
            </div>

            {/* 课程模块和任务 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧模块列表 */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">课程模块</h3>
                    <button
                      onClick={handleAddModule}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                    >
                      添加模块
                    </button>
                  </div>
                  <div className="space-y-2">
                    {course.modules.map((module) => (
                      <div
                        key={module.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${activeModuleId === module.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => setActiveModuleId(module.id)}
                      >
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.tasks.length} 个任务</p>
                      </div>
                    ))}
                    {course.modules.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        点击添加模块开始创建课程
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 右侧模块和任务编辑 */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  {course.modules.map((module) => (
                    <div key={module.id} className={activeModuleId === module.id ? '' : 'hidden'}>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">模块信息</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">模块标题</label>
                            <input
                              type="text"
                              value={module.title}
                              onChange={(e) => handleModuleUpdate(module.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">模块图标</label>
                            <input
                              type="text"
                              value={module.icon || ''}
                              onChange={(e) => handleModuleUpdate(module.id, 'icon', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="例如: book"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">模块描述</label>
                            <textarea
                              value={module.description || ''}
                              onChange={(e) => handleModuleUpdate(module.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">任务列表</h3>
                          <button
                            onClick={() => handleAddTask(module.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                          >
                            添加任务
                          </button>
                        </div>
                        <div className="space-y-4">
                          {module.tasks.map((task) => (
                            <div key={task.id} className="border border-gray-200 rounded-md p-4">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                <div className="flex space-x-2">
                                  <button className="px-2 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600">
                                    编辑
                                  </button>
                                  <button className="px-2 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600">
                                    删除
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">任务状态</label>
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleTaskUpdate(module.id, task.id, 'status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="pending">待开始</option>
                                    <option value="ongoing">进行中</option>
                                    <option value="completed">已完成</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">任务时长</label>
                                  <input
                                    type="text"
                                    value={task.duration || ''}
                                    onChange={(e) => handleTaskUpdate(module.id, task.id, 'duration', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="例如: 45分钟"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">任务内容</label>
                                  <textarea
                                    value={task.content || ''}
                                    onChange={(e) => handleTaskUpdate(module.id, task.id, 'content', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">任务要求</label>
                                  <textarea
                                    value={task.requirements?.join('\n') || ''}
                                    onChange={(e) => handleTaskUpdate(module.id, task.id, 'requirements', e.target.value.split('\n'))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="每行一个要求"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {module.tasks.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                              点击添加任务
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {course.modules.length === 0 && (
                    <div className="text-center py-16 text-gray-500">
                      点击左侧添加模块开始创建课程
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
