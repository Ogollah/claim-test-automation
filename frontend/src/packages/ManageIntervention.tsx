'use client';
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Intervention, Package } from "@/lib/types";
import { getIntervention, postIntervention, updateIntervention, deleteIntervention, getPackages } from "@/lib/api";
import { toast } from "sonner";
import { useAuthSession } from "@/hook/useAuth";

export default function ManageIntervention() {
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
    const [formData, setFormData] = useState({
        package_id: "",
        code: "",
        name: "",
        is_complex: false,
        created_by: "",
        updated_by: ""
    });

    const { userId } = useAuthSession();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [interventionsData, packagesData] = await Promise.all([
                    getIntervention(),
                    getPackages()
                ]);
                setInterventions(interventionsData ?? []);
                setFilteredInterventions(interventionsData ?? []);
                setPackages(packagesData ?? []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setInterventions([]);
                setFilteredInterventions([]);
                setPackages([]);
                toast.error("Failed to fetch data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Search
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredInterventions(interventions);
        } else {
            const searchLower = searchTerm.toLowerCase();
            const filtered = interventions.filter(intervention => {
                const packageObj = packages.find(p => p.id === intervention.package_id);
                const packageCode = packageObj?.code.toLowerCase() || '';
                const interventionCode = intervention.code.toLowerCase();
                const interventionName = intervention.name.toLowerCase();
                const isComplex = intervention.is_complex ? 'true complex yes 1' : 'false simple no 0';

                return (
                    packageCode.includes(searchLower) ||
                    interventionCode.includes(searchLower) ||
                    interventionName.includes(searchLower) ||
                    isComplex.includes(searchLower)
                );
            });
            setFilteredInterventions(filtered);
        }
        setCurrentPage(1);
    }, [searchTerm, interventions, packages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    // Get default package based on search
    const getDefaultPackageId = () => {
        if (searchTerm.trim() === "") {
            return packages[0]?.id?.toString() || "";
        }

        // Find package that matches search term
        const matchingPackage = packages.find(pkg =>
            pkg.code.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return matchingPackage?.id?.toString() || packages[0]?.id?.toString() || "";
    };

    // Pagination calculations
    const totalPages = Math.ceil(filteredInterventions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredInterventions.slice(startIndex, endIndex);

    const handleDelete = async (id: string) => {
        toast.info("Are you sure you want to delete this intervention?", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deleteIntervention(Number(id));
                        const updatedInterventions = interventions.filter(intervention => intervention.id !== Number(id));
                        setInterventions(updatedInterventions);
                        toast.success("Intervention deleted successfully");
                        if (currentItems.length === 1 && currentPage > 1) {
                            setCurrentPage(prev => prev - 1);
                        }
                    } catch (error) {
                        console.error("Error deleting intervention:", error);
                        toast.error("Failed to delete intervention");
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => {
                    toast.dismiss();
                },
            },
            duration: 10000,
        });
    };

    const handleAddNew = () => {
        setEditingIntervention(null);
        setFormData({
            package_id: getDefaultPackageId(),
            code: "",
            name: "",
            is_complex: false,
            created_by: userId || "",
            updated_by: userId || ""
        });
        setShowForm(true);
    };

    const handleEdit = (intervention: Intervention) => {
        setEditingIntervention(intervention);
        setFormData({
            package_id: intervention.package_id?.toString() || "",
            code: intervention.code,
            name: intervention.name,
            is_complex: Boolean(intervention.is_complex),
            created_by: userId || "",
            updated_by: userId || ""
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.package_id || !formData.code.trim() || !formData.name.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            if (editingIntervention && editingIntervention.id) {
                const updatedIntervention = await updateIntervention(editingIntervention.id, {
                    ...formData,
                    package_id: Number(formData.package_id),
                    is_complex: formData.is_complex ? 1 : 0
                });
                const updatedInterventions = interventions.map(intervention =>
                    intervention.id === editingIntervention.id && updatedIntervention ? updatedIntervention.updatedIntervention : intervention
                );
                console.log("Updated intervention response:", updatedIntervention);
                setInterventions(updatedInterventions);
                toast.success("Intervention updated successfully");
            } else {
                const newIntervention = await postIntervention({
                    ...formData,
                    package_id: Number(formData.package_id),
                    is_complex: formData.is_complex ? 1 : 0
                });
                if (newIntervention?.status === 201) {

                    let interventionToAdd: Intervention | undefined;

                    if (newIntervention && 'data' in newIntervention.data.intervention && newIntervention.data) {
                        interventionToAdd = newIntervention.data.intervention as Intervention;
                    } else if (newIntervention && 'id' in newIntervention.data.intervention && 'package_id' in newIntervention.data.intervention && 'name' in newIntervention.data.intervention && 'code' in newIntervention.data.intervention) {
                        interventionToAdd = newIntervention.data.intervention as Intervention;
                    }

                    if (interventionToAdd) {
                        const updatedInterventions = [interventionToAdd, ...interventions];
                        setInterventions(updatedInterventions);
                        toast.success("Intervention created successfully");
                        const newTotalPages = Math.ceil((filteredInterventions.length + 1) / itemsPerPage);
                        if (newTotalPages > totalPages) {
                            setCurrentPage(newTotalPages);
                        }
                    } else {
                        throw new Error("Invalid intervention data received");
                    }
                } else {
                    toast.error("Failed to create intervention");
                    throw new Error("Failed to create intervention");
                }
            }

            setShowForm(false);
            setFormData({
                package_id: "",
                code: "",
                name: "",
                is_complex: false,
                created_by: "",
                updated_by: ""
            });
            setEditingIntervention(null);
        } catch (error) {
            console.error("Error saving intervention:", error);
            toast.error("Failed to save intervention");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({
            package_id: "",
            code: "",
            name: "",
            is_complex: false,
            created_by: "",
            updated_by: ""
        });
        setEditingIntervention(null);
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <PaginationItem key="first">
                    <PaginationLink onClick={() => goToPage(1)}>
                        <ChevronsLeft className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>
            );
        }

        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious
                    onClick={() => goToPage(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
            </PaginationItem>
        );

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        onClick={() => goToPage(page)}
                        isActive={page === currentPage}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        items.push(
            <PaginationItem key="next">
                <PaginationNext
                    onClick={() => goToPage(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
            </PaginationItem>
        );

        if (endPage < totalPages) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink onClick={() => goToPage(totalPages)}>
                        <ChevronsRight className="h-4 w-4" />
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const getPackageCode = (packageId: number) => {
        const packageObj = packages.find(p => p.id === packageId);
        return packageObj?.code || "N/A";
    };

    const highlightText = (text: string, search: string) => {
        if (!search.trim()) return text;

        const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="bg-green-200">$1</span>');
    };

    return (
        <div className="mx-auto py-3">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by package code, intervention code, name, or complexity..."
                            className="border border-gray-300 rounded-md py-2 px-10 pr-10"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSearch}
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                    <Button
                        onClick={handleAddNew}
                        className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Intervention
                    </Button>
                </div>

                {/* Search results info */}
                {searchTerm && (
                    <div className="mb-4 text-sm text-gray-600">
                        Found {filteredInterventions.length} intervention(s) matching "{searchTerm}"
                        <Button
                            variant="link"
                            onClick={clearSearch}
                            className="ml-2 text-green-900 hover:text-green-700 p-0 h-auto"
                        >
                            Clear search
                        </Button>
                    </div>
                )}

                <div className={`grid gap-6 ${showForm ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                    <div className={showForm ? 'lg:col-span-2' : ''}>
                        <div className="bg-white rounded-lg border border-gray-200">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900"></div>
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="font-semibold text-gray-500">Package Code</TableHead>
                                                <TableHead className="font-semibold text-gray-500">Intervention Code</TableHead>
                                                <TableHead className="font-semibold text-gray-500">Intervention Name</TableHead>
                                                <TableHead className="font-semibold text-gray-500">Complexity</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-500">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentItems.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-gray-500 h-32">
                                                        {searchTerm ? 'No interventions found matching your search' : 'No interventions found'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                currentItems.map((intervention) => (
                                                    <TableRow key={intervention.id} className="hover:bg-gray-50/50">
                                                        <TableCell className="font-medium text-gray-600">
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: highlightText(getPackageCode(intervention.package_id), searchTerm)
                                                            }} />
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: highlightText(intervention.code, searchTerm)
                                                            }} />
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">
                                                            <span dangerouslySetInnerHTML={{
                                                                __html: highlightText(intervention.name, searchTerm)
                                                            }} />
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">
                                                            {intervention.is_complex ? (
                                                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Complex</span>
                                                            ) : (
                                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Simple</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleEdit(intervention)}
                                                                    className="text-green-900 hover:text-green-700 hover:bg-green-50"
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(String(intervention.id))}
                                                                    className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>

                                    {filteredInterventions.length > 0 && (
                                        <div className="flex items-center justify-between px-4 py-4 border-t">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">Show</span>
                                                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                                                        <SelectTrigger className="w-20 h-8">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="5">5</SelectItem>
                                                            <SelectItem value="10">10</SelectItem>
                                                            <SelectItem value="20">20</SelectItem>
                                                            <SelectItem value="50">50</SelectItem>
                                                            <SelectItem value="100">100</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredInterventions.length)} of {filteredInterventions.length} entries
                                                    {searchTerm && ` (filtered from ${interventions.length} total)`}
                                                </div>
                                            </div>
                                            <Pagination>
                                                <PaginationContent>
                                                    {renderPaginationItems()}
                                                </PaginationContent>
                                            </Pagination>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {showForm && (
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-green-900">
                                        {editingIntervention ? 'Edit Intervention' : 'Add New Intervention'}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCancel}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="package_id" className="text-sm font-medium text-gray-600">
                                            Package <span className="text-red-500">*</span>
                                        </Label>
                                        <Select disabled={!!editingIntervention} value={formData.package_id} onValueChange={(value) => setFormData(prev => ({ ...prev, package_id: value }))}>
                                            <SelectTrigger className="text-gray-500 w-full">
                                                <SelectValue placeholder="Select a package" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {packages.map((pkg) => (
                                                    <SelectItem key={pkg.id} value={pkg.id?.toString() || ""}>
                                                        {pkg.code} - {pkg.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="code" className="text-sm font-medium text-gray-600">
                                            Intervention Code <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                            placeholder="Enter intervention code"
                                            required
                                            className="text-gray-600"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-600">
                                            Intervention Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter intervention name"
                                            required
                                            className="text-gray-600"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="is_complex"
                                            checked={formData.is_complex}
                                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_complex: checked as boolean }))}
                                            className="border-green-900 text-green-900 focus:ring-green-900"
                                        />
                                        <Label htmlFor="is_complex" className="text-sm font-medium text-gray-600">
                                            Complex Intervention
                                        </Label>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-green-900 text-white hover:bg-green-700 flex items-center justify-center gap-2"
                                        >
                                            <Save size={16} />
                                            {editingIntervention ? 'Update' : 'Save'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="text-gray-700 hover:bg-red-400 hover:text-white flex-1 flex items-center justify-center gap-2"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}