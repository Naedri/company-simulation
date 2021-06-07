import { getUserInfo } from "../../utils/rest/auth";
import { useRouter } from 'next/router'

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

const View = ({ user }) => {
  const router = useRouter();
  const { id } = router.query;
  return (
      <div className="h-screen w-full">
        <div className="simulation">
          <div className="simulation__left-panel">
            <p>Configure</p>
            <button>Run one step</button>
            <button>Run</button>
            <button>Stop</button>
          </div>
          <div className="simulation__right-panel">Right: {id}</div>
        </div>
      </div>
  );
};

export default View;
