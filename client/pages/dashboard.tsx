import { getUserInfo } from "../utils/rest/auth";
import Layout from "../components/layout";

export async function getServerSideProps(context) {
  const { user } = await getUserInfo(context.req.cookies?.token);

  if (user) {
    return {
      props: { user },
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

const Dashboard = ({ user }) => {
  return (
    <Layout user={user}>
      <section>
        <p>Dashboard</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </section>
    </Layout>
  );
};

export default Dashboard;
