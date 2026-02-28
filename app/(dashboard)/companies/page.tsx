
import { getCompanies, createCompany } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// Client component wrapper for the form could be separated, but for simplicity:
import { SubmitButton } from '@/components/SubmitButton' // We need to create this reusable component or define inline

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
    const { data: companies, error } = await getCompanies()

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-primary">Insurance Companies</h1>
                <CreateCompanyDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Portal</TableHead>
                            <TableHead>Support</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No companies found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            companies?.map((company: any) => (
                                <TableRow key={company.id}>
                                    <TableCell className="font-medium">{company.name}</TableCell>
                                    <TableCell>{company.type}</TableCell>
                                    <TableCell>
                                        {company.portal_url && (
                                            <Link href={company.portal_url} target="_blank" className="flex items-center text-primary hover:underline">
                                                Link <ExternalLink className="ml-1 h-3 w-3" />
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {company.support_phone} {company.support_email && `| ${company.support_email}`}
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
