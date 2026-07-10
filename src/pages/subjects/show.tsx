import {ClassDetails, Department, Subject, User} from "@/types";
import {useShow} from "@refinedev/core";
import {useParams} from "react-router";
import {useMemo} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {getTeacherPlaceholderUrl} from "@/lib/utils.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";
import {useTable} from "@refinedev/react-table";
import {ShowView, ShowViewHeader} from "@/components/refine-ui/views/show-view.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";

type SubjectDetails = {
    subject: Subject & {
        departments?: Department | null;
    };
    totals: {
        classes: number;
    }
}

const SubjectsShow = () => {
    const {id} = useParams();

    const {query} = useShow<SubjectDetails>({
        resource: "subjects",
    })

    const details = query.data?.data;


    const classTable = useTable<ClassDetails>({
        columns: useMemo<ColumnDef<ClassDetails>[]>(()=>[
            {
                id: 'bannerUrl',
                accessorKey: 'bannerUrl',
                size: 80,
                header: () => <p className="column-title ml-2">Banner</p>,
                cell: ({ getValue }) => (
                    <div className="flex items-left justify-left ml-2">
                        <img
                            src={getValue<string>() || '/placeholder-class.png'}
                            alt="Class Banner"
                            className="w-10 h-10 rounded object-cover"
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
                id: 'status',
                accessorKey: 'status',
                size: 100,
                header: ()=> <p className="column-title ml-2">Status</p>,
                cell: ({getValue})=> <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'teacher',
                accessorKey: 'teacher.name',
                size: 150,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({getValue}) => <Badge variant="secondary">{getValue<string>()}</Badge>
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 100,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({getValue}) => <Badge variant="secondary">{getValue<string>()}</Badge>
            },
            {
                id: 'details',
                size: 100,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
            }

        ], []),
        refineCoreProps:{
            resource: `subjects/${id}/classes`,
            pagination: {pageSize: 10, mode: "server"},
            sorters: {
                initial:[
                    {field: 'id', order: 'desc'}
                ]
            },
        }

    })

    const teacherTable = useTable<User>({
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
                cell: ({ row }) => <ShowButton resource="faculty" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
            }
        ], []),
        refineCoreProps:{
            resource: `subjects/${id}/users`,
            pagination: {pageSize: 10, mode: "server"},
            filters: {
                permanent: [
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

    const totalTeachers = teacherTable.refineCore.tableQuery?.data?.total ?? 0;


    if (query.isLoading || query.isError || !details) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader resource="subjects" title="Subject Details" />
                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Loading subject details..."
                        : query.isError
                            ? "Failed to load subject details."
                            : "Subject details not found."}
                </p>
            </ShowView>
        );
    }


    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="subjects" title="Subject Details" />

            <Card className="details-card">
                <div className="details-header">
                    <div>
                        <h1>{details.subject.name}</h1>
                        <p>{details.subject.description}</p>
                    </div>

                    <div>
                        <Badge variant="outline">{details.subject.code}</Badge>
                    </div>
                </div>

                <div className="instructor">
                    <p>Departments</p>
                    <div>
                        <div className="department">
                            <p>{details.subject.department?.name}</p>
                            <p>{details.subject.department?.description}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Classes</CardTitle>
                    <Badge variant="secondary">{details.totals.classes}</Badge>
                </CardHeader>
                <CardContent>
                    <DataTable table={classTable} />
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Teachers</CardTitle>
                    <Badge variant="secondary">{totalTeachers}</Badge>
                </CardHeader>
                <CardContent>
                    <DataTable table={teacherTable} />
                </CardContent>
            </Card>
        </ShowView>
    );
}
export default SubjectsShow
