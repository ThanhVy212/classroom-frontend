import {useParams} from "react-router";
import {useShow} from "@refinedev/core";
import {useTable} from "@refinedev/react-table";
import {Department, Subject} from "@/types";
import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";
import {ShowView, ShowViewHeader} from "@/components/refine-ui/views/show-view.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";


const DepartmentsShow = () => {
    const {id} = useParams();

    const {query} = useShow<{ department: Department }>({resource: "departments",})

    const departmentDetails = query.data?.data;


    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(()=>[
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
                cell: ({ row }) => <ShowButton resource="subjects" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
            }

        ], []),
        refineCoreProps:{
            resource: `departments/${id}/subjects`,
            pagination: {pageSize: 10, mode: "server"},
            sorters: {
                initial:[
                    {field: 'id', order: 'desc'}
                ]
            },
        }

    })

    const totalSubjects = subjectTable.refineCore.tableQuery?.data?.total ?? 0;

    if (query.isLoading || query.isError || !departmentDetails) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader resource="subjects" title="Subject Details" />
                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Loading department details..."
                        : query.isError
                            ? "Failed to load department details."
                            : "Department details not found."}
                </p>
            </ShowView>
        );
    }

    const {name, code, description} = departmentDetails.department;

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="subjects" title="Deparment Details" />

            <Card className="details-card">
                <div className="details-header">
                    <div>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>

                    <div>
                        <Badge variant="outline">{code}</Badge>
                    </div>
                </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Subjects</CardTitle>
                    <Badge variant="secondary">{totalSubjects}</Badge>
                </CardHeader>
                <CardContent>
                    <DataTable table={subjectTable} />
                </CardContent>
            </Card>
        </ShowView>
    );
}
export default DepartmentsShow

