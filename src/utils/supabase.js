import { createClient } from '@supabase/supabase-js'
import { computeFileMD5 } from './md5'
// 替换为您的 Supabase 项目信息
const supabaseUrl = import.meta.env.VITE_SUBPASE_URL
const supabaseKey = import.meta.env.VITE_SUBPASE_KEY
const bucketName = import.meta.env.VITE_SUBPASE_BUCKET_NAME
const supabase = createClient(supabaseUrl, supabaseKey)

export function getPublicUrl(filepath) {
  const { data, error } = supabase.storage.from(bucketName).getPublicUrl(filepath)
  if (error)
    throw error
  return data.publicUrl
}

/**
 * 上传文件到 Supabase Storage
 * @param {File} file - 要上传的文件
 * @param {string} [folder] - 文件夹名
 * @returns {Promise<string>} - 上传成功后返回的 URL
 */
export async function uploadToSupabase(file, folder) {
  try {
    const md5 = await computeFileMD5(file)
    const filepath = folder ? `${folder}/${md5}` : md5
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filepath, file)

    if (error) {
      if (error.statusCode === '409')
        return getPublicUrl(filepath)
      console.error('Error uploading file:', error)

      throw error
    }

    return getPublicUrl(data.path)
  }
  catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

/**
 * 从 Supabase Storage 下载文件
 * @param {string} fileUrl - 文件的公开 URL
 * @returns {Promise<Blob>} - 下载的文件 Blob 对象
 */
export async function downloadFromSupabase(fileUrl) {
  try {
    const { data, error } = await supabase.storage.from('avatars').download(fileUrl)

    if (error) {
      console.error('Error downloading file:', error)
      throw error
    }

    return data
  }
  catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}
