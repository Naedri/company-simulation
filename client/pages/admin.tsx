import { getUserInfo } from "../utils/rest/auth";
import { getPermissions } from "../utils/rest/permissions";
import { useState } from "react";
import { IPermissionSchema } from "../utils/model/IPermissionSchema";
import Layout from "../components/layout";

export async function getServerSideProps(context) {
  const { user } = await getUserInfo(context.req.cookies?.token);

  if (user) {
    return {
      props: {},
    };
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
  const [permissions, setPermissions] = useState<IPermissionSchema>({});

  getPermissions().then((result) => {
    setPermissions(result);
  });


  return (
      <Layout user={user}>
        <div className="h-screen w-full">
          <header>
            <h1 className="title">Admin permissions</h1>
          </header>
            <div>{permissions.toString()}</div>
        </div>
      </Layout>
  );
};

export default Admin;
