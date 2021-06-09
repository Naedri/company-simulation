import { getUserInfo } from "../../utils/rest/auth";
import Simulation from "../../components/Simulation";
import { SimulationService } from "../../services/SimulationService";
import { createSchema } from "beautiful-react-diagrams";

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
  const { nodes, colorMap } = SimulationService.getNodes(80, 60, 50);

  const initialSchema = createSchema({
    nodes: nodes,
    links: SimulationService.getLinks(),
  });

  return (
    <div className="h-screen w-full">
      <div className="simulation">
        <div className="simulation__left-panel stack">
          <p>Configure</p>
          <button className="button">Run one step</button>
          <button className="button">Run</button>
          <button className="button danger">Stop</button>
        </div>
        <div className="simulation__right-panel">
          <Simulation initialSchema={initialSchema} />
        </div>
        <div className="simulation__info-panel">
          <p>Legend</p>
        </div>
      </div>
    </div>
  );
};

export default View;
