import { getUserInfo } from "../utils/rest/auth";

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
    <section>
      <p>Dashboard</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </section>
  );
};

export default Dashboard;
