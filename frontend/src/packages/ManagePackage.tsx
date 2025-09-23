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
import { Package } from "@/lib/types";
import { getPackages, postPackage, updatePackage, deletePackage } from "@/lib/api";
import { toast } from "sonner";

export default function ManagePackage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);
    const [formData, setFormData] = useState({
        code: "",
        name: ""
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const pkg = await getPackages();
                setPackages(pkg ?? []);
                setFilteredPackages(pkg ?? []);
            } catch (error) {
                console.error("Error fetching packages:", error);
                setPackages([]);
                setFilteredPackages([]);
                toast.error("Failed to fetch packages");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPackages(packages);
        } else {
            const filtered = packages.filter(pkg =>
                pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pkg.code.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPackages(filtered);
        }
        setCurrentPage(1);
    }, [searchTerm, packages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredPackages.slice(startIndex, endIndex);

    const handleDelete = async (id: string) => {
        toast.info("Are you sure you want to delete this package? Deleting package will delete associated interventions", {
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await deletePackage(Number(id));
                        const updatedPackages = packages.filter(pkg => pkg.id !== Number(id));
                        setPackages(updatedPackages);
                        toast.success("Package deleted successfully");
                        if (currentItems.length === 1 && currentPage > 1) {
                            setCurrentPage(prev => prev - 1);
                        }
                    } catch (error) {
                        console.error("Error deleting package:", error);
                        toast.error("Failed to delete package");
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
        setEditingPackage(null);
        setFormData({ code: "", name: "" });
        setShowForm(true);
    };

    const handleEdit = (pkg: Package) => {
        setEditingPackage(pkg);
        setFormData({ code: pkg.code, name: pkg.name });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.code.trim() || !formData.name.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            if (editingPackage && editingPackage.id) {
                const updatedPackage = await updatePackage(editingPackage.id, formData);
                const updatedPackages = packages.map(pkg =>
                    pkg.id === editingPackage.id && updatedPackage ? updatedPackage : pkg
                );
                setPackages(updatedPackages);
                toast.success("Package updated successfully");
            } else {
                const newPackage = await postPackage(formData);
                let pkgToAdd: Package | undefined;

                if (newPackage && 'id' in newPackage && 'name' in newPackage && 'code' in newPackage) {
                    pkgToAdd = newPackage as Package;
                } else if (newPackage && 'data' in newPackage && newPackage.data && 'id' in newPackage.data && 'name' in newPackage.data && 'code' in newPackage.data) {
                    pkgToAdd = newPackage.data as Package;
                }

                if (pkgToAdd) {
                    const updatedPackages = [...packages, pkgToAdd];
                    setPackages(updatedPackages);
                    toast.success("Package created successfully");
                    const newTotalPages = Math.ceil((filteredPackages.length + 1) / itemsPerPage);
                    if (newTotalPages > totalPages) {
                        setCurrentPage(newTotalPages);
                    }
                } else {
                    throw new Error("Invalid package data received");
                }
            }

            setShowForm(false);
            setFormData({ code: "", name: "" });
            setEditingPackage(null);
        } catch (error) {
            console.error("Error saving package:", error);
            toast.error("Failed to save package");
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ code: "", name: "" });
        setEditingPackage(null);
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

    return (
        <div className="mx-auto py-3">
            <div className="bg-white rounded-sm shadow-md p-6 mb-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 max-w-md relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search packages by name or code..."
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
                        Add New Package
                    </Button>
                </div>

                {/* Search results info */}
                {searchTerm && (
                    <div className="mb-4 text-sm text-gray-600">
                        Found {filteredPackages.length} package(s) matching "{searchTerm}"
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
                                                <TableHead className="font-semibold text-gray-500">Package Name</TableHead>
                                                <TableHead className="text-right font-semibold text-gray-500">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {currentItems.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center text-gray-500 h-32">
                                                        {searchTerm ? 'No packages found matching your search' : 'No packages found'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                currentItems.map((pkg) => (
                                                    <TableRow key={pkg.id} className="hover:bg-gray-50/50">
                                                        <TableCell className="font-medium text-gray-600">
                                                            {searchTerm ? (
                                                                <span dangerouslySetInnerHTML={{
                                                                    __html: pkg.code.replace(
                                                                        new RegExp(searchTerm, 'gi'),
                                                                        match => `<span class="bg-green-200">${match}</span>`
                                                                    )
                                                                }} />
                                                            ) : (
                                                                pkg.code
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">
                                                            {searchTerm ? (
                                                                <span dangerouslySetInnerHTML={{
                                                                    __html: pkg.name.replace(
                                                                        new RegExp(searchTerm, 'gi'),
                                                                        match => `<span class="bg-green-200">${match}</span>`
                                                                    )
                                                                }} />
                                                            ) : (
                                                                pkg.name
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleEdit(pkg)}
                                                                    className="text-green-900 hover:text-green-700 hover:bg-green-50"
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(String(pkg.id))}
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

                                    {filteredPackages.length > 0 && (
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
                                                    {/* <span className="text-sm text-gray-600">entries per page</span> */}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPackages.length)} of {filteredPackages.length} entries
                                                    {searchTerm && ` (filtered from ${packages.length} total)`}
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
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {editingPackage ? 'Edit Package' : 'Add New Package'}
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
                                        <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                                            Package Code
                                        </Label>
                                        <Input
                                            type="text"
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                            placeholder="Enter package code"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Package Name
                                        </Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter package name"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-green-900 text-white hover:bg-green-700 flex items-center justify-center gap-2"
                                        >
                                            <Save size={16} />
                                            {editingPackage ? 'Update' : 'Save'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            className="text-gray-700 hover:bg-gray-100"
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
