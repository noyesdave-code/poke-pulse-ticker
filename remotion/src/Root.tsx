import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { InvestorPitch } from "./InvestorPitch";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="youtube"
      component={MainVideo}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="investor-pitch"
      component={InvestorPitch}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
