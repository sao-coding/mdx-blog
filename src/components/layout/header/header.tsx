import DevicesStatus from "./devices-status";
import Nav from "./nav";
import SiteOwnerAvatar from "./site-owner-avatar";

const Header = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-md h-16">
      <div className="grid grid-cols-3 max-w-7xl mx-auto h-full">
        <div className="flex items-center space-x-4">
          <SiteOwnerAvatar />
          <DevicesStatus />
        </div>
        <div className="flex justify-center items-center">
          <Nav />
        </div>
        <div className=""></div>
      </div>
    </header>
  );
};

export default Header;
