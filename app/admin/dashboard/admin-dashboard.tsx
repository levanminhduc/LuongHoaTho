"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Upload, FileSpreadsheet, Users, DollarSign, LogOut, RefreshCw, Download } from "lucide-react"
import { EmployeeImportSection } from "@/components/employee-import-section"

interface PayrollRecord {
  id: number
  employee_id: string
  full_name: string
  cccd: string
  position: string
  salary_month: string
  total_income: number
  deductions: number
  net_salary: number
  source_file: string
  created_at: string
}

export function AdminDashboard() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([])
  const [uploadMessage, setUploadMessage] = useState("")
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalEmployees: 0,
    totalSalary: 0,
  })
  const [downloadingSample, setDownloadingSample] = useState(false)
  const [downloadingMultiple, setDownloadingMultiple] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra authentication
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
      return
    }

    fetchPayrolls()
  }, [router])

  const fetchPayrolls = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/admin/payrolls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPayrolls(data.payrolls)
        setStats(data.stats)
      } else if (response.status === 401) {
        localStorage.removeItem("admin_token")
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Error fetching payrolls:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files || files.length === 0) {
      setUploadMessage("Vui lòng chọn ít nhất một file Excel")
      return
    }

    setUploading(true)
    setUploadMessage("")

    try {
      const formData = new FormData()
      Array.from(files).forEach((file, index) => {
        formData.append(`file${index}`, file)
      })

      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadMessage(`Thành công! Đã import ${data.totalRecords} bản ghi từ ${data.filesProcessed} file(s)`)
        fetchPayrolls() // Refresh data
        setFiles(null)
        // Reset file input
        const fileInput = document.getElementById("files") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        setUploadMessage(`Lỗi: ${data.error}`)
      }
    } catch (error) {
      setUploadMessage("Có lỗi xảy ra khi upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleDownloadSample = async () => {
    setDownloadingSample(true)
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/admin/download-sample", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "bang-luong-mau.xlsx"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setUploadMessage("Lỗi khi tải file mẫu")
      }
    } catch (error) {
      setUploadMessage("Có lỗi xảy ra khi tải file mẫu")
    } finally {
      setDownloadingSample(false)
    }
  }

  const handleDownloadMultipleSamples = async () => {
    setDownloadingMultiple(true)
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/admin/download-multiple-samples", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "bang-luong-mau-files.zip"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setUploadMessage("Lỗi khi tải file mẫu")
      }
    } catch (error) {
      setUploadMessage("Có lỗi xảy ra khi tải file mẫu")
    } finally {
      setDownloadingMultiple(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard - Hòa Thọ Điện Bàn</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Đăng Xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Bản Ghi</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Số Nhân Viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Lương</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalSalary)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload File Excel</CardTitle>
            <CardDescription>Chọn một hoặc nhiều file Excel chứa dữ liệu lương để import vào hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="files">Chọn File Excel (.xlsx, .xls)</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept=".xlsx,.xls"
                  onChange={(e) => setFiles(e.target.files)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {uploadMessage && (
                <Alert
                  className={
                    uploadMessage.includes("Thành công") ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }
                >
                  <AlertDescription
                    className={uploadMessage.includes("Thành công") ? "text-green-800" : "text-red-800"}
                  >
                    {uploadMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={uploading || !files}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang Upload...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Files
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">File Excel Mẫu</h4>
                  <p className="text-sm text-gray-500">Tải xuống file mẫu để tham khảo định dạng dữ liệu</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownloadSample}
                    disabled={downloadingSample}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    {downloadingSample ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        File Đơn
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDownloadMultipleSamples}
                    disabled={downloadingMultiple}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    {downloadingMultiple ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4" />
                        Nhiều File
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Import Section */}
        <div className="mb-8">
          <EmployeeImportSection />
        </div>

        {/* Payroll Data Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dữ Liệu Lương</CardTitle>
              <CardDescription>Danh sách tất cả bản ghi lương đã được import</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchPayrolls}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm Mới
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã NV</TableHead>
                    <TableHead>Họ Tên</TableHead>
                    <TableHead>CCCD</TableHead>
                    <TableHead>Chức Vụ</TableHead>
                    <TableHead>Tháng Lương</TableHead>
                    <TableHead>Thu Nhập</TableHead>
                    <TableHead>Khấu Trừ</TableHead>
                    <TableHead>Thực Lĩnh</TableHead>
                    <TableHead>File Nguồn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employee_id}</TableCell>
                      <TableCell>{record.full_name}</TableCell>
                      <TableCell>{record.cccd}</TableCell>
                      <TableCell>{record.position || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.salary_month}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(record.total_income)}</TableCell>
                      <TableCell>{formatCurrency(record.deductions)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(record.net_salary)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{record.source_file}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {payrolls.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Chưa có dữ liệu lương nào. Hãy upload file Excel để bắt đầu.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
