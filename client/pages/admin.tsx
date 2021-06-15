import { getUserInfo } from "../utils/rest/auth";
import { getPermissions, updatePermissions } from "../utils/rest/permissions";
import { useEffect, useState } from "react";
import { IPermissionSchema, isIPermissionSchema } from "../utils/model/IPermissionSchema";
import { InteractionProps } from "react-json-view";
import PermissionsNode from "../components/PermissionsNode";
import { useToasts } from "react-toast-notifications";
import Layout from "../components/layout";

export async function getServerSideProps(context) {
    const { user } = await getUserInfo(context.req.cookies?.token);

    if (user) {
        if (user.isAdmin) {
            return {
                props: { user },
            };
        } else {
            return {
                props: {},
                redirect: {
                    destination: "/",
                    permanent: false
                }
            };
        }
    }
    return {
        props: {},
        redirect: {
            destination: "login",
            permanent: false,
        },
    };
}

const Admin = ({ user }) => {
    const { addToast } = useToasts();

    const [loading, setLoading] = useState<boolean>(false);
    const [permissions, setPermissions] = useState<IPermissionSchema>({});

    const updatePermissionsFromServer = () => {
        setLoading(true);
        getPermissions().then(result => {
            setPermissions(result);
            setLoading(false);
        });
    };

    const updatePermissionsToServer = (data: IPermissionSchema) => {
        updatePermissions(data).then(() => {
            addToast("Permissions updated", {
                appearance: "success",
                autoDismiss: true,
                autoDismissTimeout: 1000
            });
        }).catch(error => {
            addToast(error.message, {
                appearance: "error",
                autoDismiss: true,
            });
            updatePermissionsFromServer();
        });
    };

    useEffect(updatePermissionsFromServer, []);

    const handleEdit = (edit: InteractionProps) => {
        if (isIPermissionSchema(edit.updated_src)) {
            setPermissions(edit.updated_src);
            updatePermissionsToServer(edit.updated_src);
        } else {
            addToast("An error occurred : Schema is not valid", {
                appearance: "error",
                autoDismiss: true,
            });
            return false;
        }
    };

    const handleAdd = (edit: InteractionProps) => {
        if (isIPermissionSchema(edit.updated_src)) {
            setPermissions(edit.updated_src);
            updatePermissionsToServer(edit.updated_src);
        } else {
            const copy = {} as IPermissionSchema;
            for (const [componentType, permissions] of Object.entries(edit.updated_src)) {
                if (typeof componentType === "string") copy[componentType] = { ...{ locked: false }, ...permissions };

                if (permissions) {
                    for (const [attributeName, attributePermission] of Object.entries(permissions)) {
                        copy[componentType] = { ...copy[componentType], ...{ [attributeName]: !!attributePermission } };
                    }
                }
            }
            if (isIPermissionSchema(copy)) {
                setPermissions(copy);
                updatePermissionsToServer(copy);
            } else {
                addToast("An error occurred : Schema is not valid", {
                    appearance: "error",
                    autoDismiss: true,
                });
                return false;
            }
        }
    };

    return (
        <Layout user={user}>
            <div className="h-screen w-full">
                <header>
                    <h1 className="title">Admin permissions</h1>
                </header>
                {loading
                    ? <div className="loader"/>
                    : <PermissionsNode permissions={permissions} onEdit={handleEdit} onAdd={handleAdd} onDelete={handleEdit}/>}
            </div>
        </Layout>
    );
};

export default Admin;
