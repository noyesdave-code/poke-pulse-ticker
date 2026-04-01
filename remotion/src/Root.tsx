import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { InvestorPitch } from "./InvestorPitch";
import { FeatureShowcase } from "./FeatureShowcase";
import { GrandLaunch } from "./GrandLaunch";

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
      durationInFrames={1350}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="social-pitch"
      component={InvestorPitch}
      durationInFrames={1350}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="feature-showcase"
      component={FeatureShowcase}
      durationInFrames={2520}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="feature-showcase-yt"
      component={FeatureShowcase}
      durationInFrames={2520}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="grand-launch"
      component={GrandLaunch}
      durationInFrames={2700}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="grand-launch-yt"
      component={GrandLaunch}
      durationInFrames={2700}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
