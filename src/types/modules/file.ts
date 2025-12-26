// 文件相关类型定义
import type { PageQuery } from './api'

// 文件信息实体
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

// 文件搜索条件
export interface FileSearchCriteria {
  fileName?: string
  fileType?: string
}

// 文件分页查询参数
export type FileQuery = PageQuery<FileSearchCriteria>

// 文件上传结果
export interface UploadResult {
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
}

// 批量上传结果
export interface BatchUploadResult {
  success: UploadResult[]
  failed: {
    fileName: string
    error: string
  }[]
}
