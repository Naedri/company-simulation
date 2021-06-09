import { getUserInfo } from "../../utils/rest/auth";

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
      destination: "/login",
      permanent: false,
    },
  };
}

const View = ({ user }) => {
  return (
    <div className="h-screen w-full">
      <div className="simulation">
        <div className="simulation__left-panel stack">
          <p>Configure</p>
          <button className="button">Run one step</button>
          <button className="button">Run</button>
          <button className="button danger">Stop</button>
        </div>
        <div className="simulation__right-panel">Right</div>
      </div>
    </div>
  );
};

export default View;
