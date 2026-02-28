'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { importCustomers, type CustomerImportData } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ImportPage() {
    const [data, setData] = useState<CustomerImportData[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setError(null)
        const fileExtension = file.name.split('.').pop()?.toLowerCase()

        if (fileExtension === 'csv') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<CustomerImportData>) => {
                    const parsedData = results.data
                    validateAndSetData(parsedData)
                },
                error: (error: Error) => {
                    setError(`Error parsing CSV: ${error.message}`)
                }
            })
        } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const data = e.target?.result
                    const workbook = XLSX.read(data, { type: 'binary' })
                    const sheetName = workbook.SheetNames[0]
                    const sheet = workbook.Sheets[sheetName]
                    const parsedData = XLSX.utils.sheet_to_json(sheet) as CustomerImportData[]
                    validateAndSetData(parsedData)
                } catch (err) {
                    setError('Error parsing Excel file')
                }
            }
            reader.readAsBinaryString(file)
        } else {
            setError('Unsupported file format. Please use CSV or Excel.')
        }
    }, [])

    const validateAndSetData = (rawData: any[]) => {
        // Basic validation: Check if required fields exist
        const validData = rawData.filter(row => row.name && row.name.trim() !== '')

        if (validData.length === 0) {
            setError('No valid data found. "name" is a required field.')
            return
        }

        // Normalize keys to lowercase for consistency
        const normalizedData = validData.map(row => {
            const newRow: any = {}
            Object.keys(row).forEach(key => {
                newRow[key.toLowerCase()] = row[key]
            })
            return newRow
        })

        setData(normalizedData)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1
    })

    const handleImport = async () => {
        setIsUploading(true)
        try {
            const result = await importCustomers(data)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                router.push('/customers')
                router.refresh()
            }
        } catch (err) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsUploading(false)
        }
    }

    const downloadTemplate = () => {
        const template = [
            { name: 'John Doe', phone: '9876543210', email: 'john@example.com', address: '123 Main St', city: 'Mumbai', dob: '1990-01-01', anniversary: '2020-05-15', tags: 'VIP, Health' },
            { name: 'Jane Smith', phone: '9876543211', email: 'jane@example.com', address: '456 Park Ave', city: 'Delhi', dob: '1995-02-15', anniversary: '', tags: 'New' }
        ]
        const ws = XLSX.utils.json_to_sheet(template)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Template")
        XLSX.writeFile(wb, "customer_import_template.xlsx")
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Import Customers</h2>
                <p className="text-muted-foreground">
                    Upload a CSV or Excel file to bulk import customers.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>File Upload</CardTitle>
                        <CardDescription>
                            Drag and drop your file here or click to browse.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center gap-2">
                                <Upload className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">
                                    {isDragActive ? "Drop the file here" : "Drag & drop file here, or click to select"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Supports .csv, .xlsx, .xls
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <Button variant="outline" onClick={downloadTemplate} size="sm">
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Download Template
                            </Button>
                            {data.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {data.length} customers found
                                </p>
                            )}
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>

            {data.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Preview Data</CardTitle>
                        <CardDescription>
                            Review the data before importing. Only first 5 rows shown.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>Tags</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.slice(0, 5).map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{row.name}</TableCell>
                                            <TableCell>{row.phone}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.city}</TableCell>
                                            <TableCell>{row.tags}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setData([])}>
                                Cancel
                            </Button>
                            <Button onClick={handleImport} disabled={isUploading}>
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Import {data.length} Customers
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
