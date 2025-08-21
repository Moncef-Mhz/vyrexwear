import {
  DashboardCards,
  DashboardLinkCards,
} from "@/components/dashboard/cards";

const DashboardPage = () => {
  return (
    <div className="gap-4 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
      </div>
      <DashboardCards />
      <div className="flex-1 h-full">
        {/* Additional dashboard content can go here, such as charts or tables */}
      </div>
      <div>
        <DashboardLinkCards />
      </div>
    </div>
  );
};
export default DashboardPage;
