import http from '../utils/request'

// 文件信息
export interface FileItem {
  id: number
  fileName: string
  originalName: string
  filePath: string
  fileSize: number
  fileType: string
  fileUrl: string
  uploadTime: string
  uploader?: string
}

// 文件查询参数
export interface FileQuery {
  page?: number
  size?: number
  fileName?: string
  fileType?: string
}

// 分页结果
export interface PageResult<T> {
  records: T[]
  total: number
}

// 上传结果
export interface UploadResult {
  fileName: string
  filePath: string
  fileSize: number
  fileType: string
  fileUrl: string
}

export const fileApi = {
  // 上传单个文件
  upload: (file: File, category?: string) => {
    const formData = new FormData()
    formData.append('file', file)
    if (category) {
      formData.append('category', category)
    }
    return http.post<UploadResult>('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 上传多个文件
  uploadBatch: (files: File[], category?: string) => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file)
    })
    if (category) {
      formData.append('category', category)
    }
    return http.post<UploadResult[]>('/file/upload/batch', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 分页查询文件列表
  page: (params: FileQuery) =>
    http.get<PageResult<FileItem>>('/file/page', { params }),

  // 删除文件
  remove: (id: number) =>
    http.delete<void>(`/file/${id}`),

  // 批量删除文件
  batchRemove: (ids: number[]) =>
    http.delete<void>('/file/batch', { data: ids }),

  // 获取文件详情
  detail: (id: number) =>
    http.get<FileItem>(`/file/${id}`),

  // 下载文件
  download: (id: number) =>
    http.get(`/file/download/${id}`, { responseType: 'blob' }),

  // 获取文件预览URL
  getPreviewUrl: (id: number) =>
    `${http.defaults.baseURL}/file/preview/${id}`,

  // 获取文件访问URL
  getAccessUrl: (id: number) =>
    `${http.defaults.baseURL}/file/access/${id}`,
}