'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Course } from '@/types'

// 模拟课程数据
const mockCourses: Course[] = [
  {
    id: '1',
    title: '调研方法入门',
    description: '学习基本的调研方法和技巧',
    modules: [],
    totalDuration: '3小时',
    totalTasks: 6
  },
  {
    id: '2',
    title: '实地考察实践',
    description: '通过实地考察学习调研方法',
    modules: [],
    totalDuration: '4小时',
    totalTasks: 8
  }
]

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null)
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
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

  const handleCreateCourse = () => {
    // 跳转到课程创建页面
    router.push('/teacher/dashboard/create-course')
  }

  const handleEditCourse = (courseId: string) => {
    // 跳转到课程编辑页面
    router.push(`/teacher/dashboard/edit-course?id=${courseId}`)
  }

  const handleDeleteCourse = (courseId: string) => {
    // 删除课程
    if (confirm('确定要删除这门课程吗？')) {
      setCourses(prev => prev.filter(course => course.id !== courseId))
      console.log('删除课程:', courseId)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">加载中...</div>
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
              <span className="mr-4 text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => supabase.auth.signOut().then(() => router.push('/auth/login'))}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                退出登录
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
              className="block px-3 py-2 rounded-md text-base font-medium bg-blue-50 text-blue-700"
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
            {/* 页面标题和操作按钮 */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">我的课程</h2>
              <button
                onClick={handleCreateCourse}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                创建新课程
              </button>
            </div>

            {/* 课程列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>总时长: {course.totalDuration}</span>
                    <span>任务数: {course.totalTasks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
