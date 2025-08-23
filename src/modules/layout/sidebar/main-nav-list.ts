import {
    CirclePlus,
    Database,
    FileChartLine,
} from "lucide-react";

const supreme = [{
    title: "Custom storage fields",
    url: "#",
    icon: CirclePlus,
    isActive: true,
    type: "supreme",
    items: [
        {
            title: "Add storage fields",
            url: "/supreme/custom-storage-fields/add-new",
        },
        {
            title: "All cloud storages",
            url: "/supreme/storages",
        },
    ],
},]

const dashboard = [
    {
    title: "Products",
    url: "#",
    icon: FileChartLine,
    isActive: false,
    type: "dashboard",
    items: [
        {
            title: "Product List",
            url: "/dashboard/products",
        },
        {
            title: "Create product",
            url: "/dashboard/products/create",
        },
        {
            title: "Categories",
            url: "/dashboard/products/categories",
        },
    ],
},{
    title: "Blog post",
    url: "#",
    icon: FileChartLine,
    isActive: false,
    type: "dashboard",
    items: [
        {
            title: "Blog",
            url: "/dashboard/post",
        },
        {
            title: "Add new post",
            url: "/dashboard/post/add-new",
        },
        {
            title: "Categories list",
            url: "/dashboard/post/categorie",
        },
        {
            title: "Add new categories",
            url: "/dashboard/post/categorie/add-new",
        },
        {
            title: "Tags list",
            url: "/dashboard/post/tag",
        },
        {
            title: "Add new tag",
            url: "/dashboard/post/tag/add-new",
        },
    ],
},
{
    title: "Storage",
    url: "#",
    icon: Database,
    isActive: false,
    type: "dashboard",
    items: [
        {
            title: "View storage",
            url: "/dashboard/storage",
        },
        {
            title: "View all storage",
            url: "/dashboard/storage/all",
        },
        {
            title: "Add new",
            url: "/dashboard/storage/add-new",
        },
    ],
},]

export const mainNavList = [
    ...dashboard,
    ...supreme
]