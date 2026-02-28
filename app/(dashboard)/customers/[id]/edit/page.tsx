
import { getCustomerById, updateCustomer } from '../../actions'
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

export default async function EditCustomerPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { data: customer, error } = await getCustomerById(params.id)

    if (error || !customer) {
        notFound()
    }

    const updateCustomerWithId = updateCustomer.bind(null, customer.id)

    return (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Customer</h1>
                <Button variant="outline" asChild>
                    <Link href={`/customers/${customer.id}`}>Cancel</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={updateCustomerWithId} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    defaultValue={customer.name}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    required
                                    defaultValue={customer.phone}
                                    placeholder="9876543210"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={customer.email || ''}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    defaultValue={customer.city || ''}
                                    placeholder="Mumbai"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    type="date"
                                    defaultValue={customer.date_of_birth || customer.dob || ''}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit">Update Customer</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
