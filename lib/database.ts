import { supabase } from './supabase';
import { Course, Module, Task, Submission, Attachment } from '@/types';

// 课程相关操作
export const courseService = {
  // 获取所有课程
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    return data;
  },

  // 获取单个课程
  async getCourse(id: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching course:', error);
      return null;
    }
    
    return data;
  },

  // 创建课程
  async createCourse(course: {
    title: string;
    description: string;
    totalDuration: string;
    totalTasks: number;
  }): Promise<Course | null> {
    const id = `course-${Date.now()}`;
    const { data, error } = await supabase
      .from('courses')
      .insert({
        id,
        ...course,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating course:', error);
      return null;
    }
    
    return data;
  },

  // 更新课程
  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating course:', error);
      return null;
    }
    
    return data;
  },

  // 删除课程
  async deleteCourse(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting course:', error);
      return false;
    }
    
    return true;
  }
};

// 模块相关操作
export const moduleService = {
  // 获取课程的所有模块
  async getModulesByCourseId(courseId: string): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId);
    
    if (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
    
    return data;
  },

  // 创建模块
  async createModule(module: {
    course_id: string;
    title: string;
    description?: string;
    icon?: string;
  }): Promise<Module | null> {
    const id = `module-${Date.now()}`;
    const { data, error } = await supabase
      .from('modules')
      .insert({
        id,
        ...module,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating module:', error);
      return null;
    }
    
    return data;
  },

  // 更新模块
  async updateModule(id: string, updates: Partial<Module>): Promise<Module | null> {
    const { data, error } = await supabase
      .from('modules')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating module:', error);
      return null;
    }
    
    return data;
  },

  // 删除模块
  async deleteModule(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting module:', error);
      return false;
    }
    
    return true;
  }
};

// 任务相关操作
export const taskService = {
  // 获取模块的所有任务
  async getTasksByModuleId(moduleId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('module_id', moduleId);
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
    
    return data;
  },

  // 创建任务
  async createTask(task: {
    module_id: string;
    title: string;
    status: 'completed' | 'ongoing' | 'pending';
    duration?: string;
    content?: string;
  }): Promise<Task | null> {
    const id = `task-${Date.now()}`;
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        id,
        ...task,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      return null;
    }
    
    return data;
  },

  // 更新任务
  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      return null;
    }
    
    return data;
  },

  // 删除任务
  async deleteTask(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }
    
    return true;
  }
};

// 提交相关操作
export const submissionService = {
  // 获取用户的任务提交
  async getSubmissionByTaskAndUser(taskId: string, userId: string): Promise<Submission | null> {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching submission:', error);
      return null;
    }
    
    return data;
  },

  // 创建提交
  async createSubmission(submission: Omit<Submission, 'id' | 'created_at' | 'updated_at'>): Promise<Submission | null> {
    const id = `submission-${Date.now()}`;
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        id,
        ...submission,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating submission:', error);
      return null;
    }
    
    return data;
  },

  // 更新提交
  async updateSubmission(id: string, updates: Partial<Submission>): Promise<Submission | null> {
    const { data, error } = await supabase
      .from('submissions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating submission:', error);
      return null;
    }
    
    return data;
  }
};

// 附件相关操作
export const attachmentService = {
  // 获取提交的所有附件
  async getAttachmentsBySubmissionId(submissionId: string): Promise<Attachment[]> {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('submission_id', submissionId);
    
    if (error) {
      console.error('Error fetching attachments:', error);
      return [];
    }
    
    return data;
  },

  // 创建附件
  async createAttachment(attachment: Omit<Attachment, 'id' | 'created_at'>): Promise<Attachment | null> {
    const id = `attachment-${Date.now()}`;
    const { data, error } = await supabase
      .from('attachments')
      .insert({
        id,
        ...attachment,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating attachment:', error);
      return null;
    }
    
    return data;
  }
};
