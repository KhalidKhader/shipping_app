import UploadComponent from "./components/UploadComponent";
import ComparisonData from "./components/ComparisonData";
import DataDisplay from "./components/DataDisplay";
import Display from "./components/Display";
import PricePredictionChart from "./components/PricePredictionChart";

const AppFile = () => (
  <div>
      <UploadComponent />
      <ComparisonData />
      <DataDisplay/>
      <Display/>
      <PricePredictionChart/>
  </div>
);

export default AppFile;
