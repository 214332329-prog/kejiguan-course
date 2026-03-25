'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import LeftSidebar from '@/components/LeftSidebar'
import CenterPanel from '@/components/CenterPanel'
import RightSidebar from '@/components/RightSidebar'
import { courseData, getCompletedTasksCount, getTotalTasksCount, getTaskById, getModuleById } from '@/lib/course-data'
import { Task, Module } from '@/types'

export default function WorkspacePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [activeModuleId, setActiveModuleId] = useState<string>('module-1')
  const router = useRouter()

  // 计算进度
  const completedTasks = getCompletedTasksCount(courseData)
  const totalTasks = getTotalTasksCount(courseData)

  useEffect(() => {
    checkUser()
    // 默认选中第一个进行中的任务
    const currentTask = courseData.modules
      .flatMap(m => m.tasks)
      .find(t => t.status === 'ongoing')
    if (currentTask) {
      setSelectedTask(currentTask)
      // 找到包含这个任务的模块
      for (const module of courseData.modules) {
        if (module.tasks.find(t => t.id === currentTask.id)) {
          setSelectedModule(module)
          setActiveModuleId(module.id)
          break
        }
      }
    }
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
    } else {
      router.push('/auth/login')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId)
    const module = getModuleById(courseData, moduleId)
    if (module) {
      setSelectedModule(module)
      // 自动选中该模块的第一个任务
      if (module.tasks.length > 0) {
        setSelectedTask(module.tasks[0])
      }
    }
  }

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task)
    // 更新当前模块
    for (const module of courseData.modules) {
      if (module.tasks.find(t => t.id === task.id)) {
        setSelectedModule(module)
        setActiveModuleId(module.id)
        break
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                科技馆课程平台
              </h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-700">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                退出
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 三栏布局 */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* 左侧边栏 */}
        <LeftSidebar
          modules={courseData.modules}
          activeModule={activeModuleId}
          selectedTask={selectedTask}
          onSelectModule={handleSelectModule}
          onSelectTask={handleSelectTask}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
        />
        
        {/* 中间内容 */}
        <main className="flex-1 overflow-hidden">
          <CenterPanel
            selectedTask={selectedTask}
            currentModule={selectedModule}
            user={user}
          />
        </main>
        
        {/* 右侧边栏 */}
        <RightSidebar
          selectedTask={selectedTask}
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          user={user}
        />
      </div>
    </div>
  )
}
