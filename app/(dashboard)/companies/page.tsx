
import { getCompaniesWithPolicyCount, createCompany, deleteCompany } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, ExternalLink, Trash2, Building } from 'lucide-react'
import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import { revalidatePath } from 'next/cache'

function CreateCompanyDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Company
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Insurance Company</DialogTitle>
                    <DialogDescription>
                        Add details of a new insurance provider.
                    </DialogDescription>
                </DialogHeader>
                <form action={async (formData) => {
                    'use server'
                    await createCompany(formData)
                }}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <select id="type" name="type" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="General">General</option>
                                <option value="Health">Health</option>
                                <option value="Life">Life</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="portal_url" className="text-right">Portal URL</Label>
                            <Input id="portal_url" name="portal_url" className="col-span-3" placeholder="https://..." />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="support_phone" className="text-right">Phone</Label>
                            <Input id="support_phone" name="support_phone" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default async function CompaniesPage() {
    const { data: companies, error } = await getCompaniesWithPolicyCount()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Insurance Companies</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage insurance providers and their details</p>
                </div>
                <CreateCompanyDialog />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/80">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-700">Name</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="font-semibold text-gray-700">Portal</TableHead>
                            <TableHead className="font-semibold text-gray-700">Support</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700">Policies</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 py-8">
                                        <Building className="h-10 w-10 text-gray-300" />
                                        <p className="text-gray-500">No companies found. Add your first company.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            companies?.map((company: any) => (
                                <TableRow key={company.id} className="hover:bg-gray-50/80 transition-colors">
                                    <TableCell className="font-medium">{company.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal">{company.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {company.portal_url && (
                                            <Link href={company.portal_url} target="_blank" className="flex items-center text-primary hover:underline text-sm">
                                                Link <ExternalLink className="ml-1 h-3 w-3" />
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {company.support_phone} {company.support_email && `| ${company.support_email}`}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-mono">
                                            {company.policy_count}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <form action={async () => {
                                            'use server'
                                            await deleteCompany(company.id)
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                                type="submit"
                                                title={company.policy_count > 0 ? 'Cannot delete: has linked policies' : 'Delete company'}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
