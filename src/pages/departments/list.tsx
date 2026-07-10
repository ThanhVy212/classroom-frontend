import {useMemo, useState} from "react";
import { Department} from "@/types";
import {useTable} from "@refinedev/react-table";
import {ColumnDef} from "@tanstack/react-table";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {Badge} from "@/components/ui/badge.tsx";

const DepartmentsList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];


    const departmentTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(()=>[
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: ()=> <p className="column-title ml-2">Code</p>,
                cell: ({getValue})=> <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title">Name</p>,
                cell: ({getValue})=><span className="text-foreground">{getValue<string>()}</span>,
                filterFn: 'includesString',
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className="column-title">Description</p>,
                cell: ({getValue}) => <span className="truncate line-clamp-2">{getValue<string>()}</span>,
            },
            {
                id: 'details',
                size: 100,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => <ShowButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
            }

        ], []),
        refineCoreProps:{
            resource: 'departments',
            pagination: {pageSize: 10, mode: "server"},
            filters: {
                permanent: [ ...searchFilters]
            },
            sorters: {
                initial:[
                    {field: 'id', order: 'desc'}
                ]
            },
        }

    })

    return (
        <ListView>
            <Breadcrumb/>
            <h1 className="page-title">Departments</h1>

            <div className="intro-row">
                <p>Manage your departments and their subjects.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon"/>
                        <Input
                            type="text"
                            placeholder="Search by name ..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex w-full sm:w-auto">
                        <CreateButton/>
                    </div>
                </div>
            </div>

            <DataTable table={departmentTable}/>
        </ListView>
    )
}
export default DepartmentsList
