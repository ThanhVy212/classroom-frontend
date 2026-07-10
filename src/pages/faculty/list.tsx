import {useMemo, useState} from "react";
import {User} from "@/types";
import {useTable} from "@refinedev/react-table";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {getTeacherPlaceholderUrl} from "@/lib/utils.ts";

const FacultyList = () => {
    const [searchQuery, setSearchQuery] = useState("");


    const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];


    const facultyTable = useTable<User>({
        columns: useMemo<ColumnDef<User>[]>(()=>[
            {
                id: 'image',
                accessorKey: 'image',
                size: 80,
                header: () => <p className="column-title ml-2">Avatar</p>,
                cell: ({ getValue, row }) => (
                    <div className="flex items-left justify-left ml-2">
                        <img
                            src={getValue<string>() || getTeacherPlaceholderUrl(row.original.name)}
                            alt="Class Banner"
                            className="size-10 rounded-full object-cover"
                        />
                    </div>
                )
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
                id: 'email',
                accessorKey: 'email',
                size: 200,
                header: ()=> <p className="column-title ml-2">Email</p>,
                cell: ({getValue})=> <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'details',
                size: 100,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => <ShowButton resource="users" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
            }
        ], []),
        refineCoreProps:{
            resource: `users`,
            pagination: {pageSize: 10, mode: "server"},
            filters: {
                permanent: [
                    ...searchFilters,
                    {
                        field: "role",
                        operator: "eq" as const,
                        value: "teacher",
                    },
                ],
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
            <h1 className="page-title">Faculty</h1>

            <div className="intro-row">
                <p>Quick access to essential metrics and management tools.</p>

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
                </div>
            </div>

            <DataTable table={facultyTable}/>
        </ListView>
    )
}
export default FacultyList
