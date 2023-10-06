import Footer from "../components/Footer";

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="bg-gray-300 w-screen h-screen flex justify-center">
      <div className="bg-white w-[390px] h-[844px] rounded-[37px] mt-11">
        {children}
        <footer className="fixed bottom-24 w-[390px] rounded-b-[37px] rounded-t-none bg-white text-gray-700 p-4 text-center">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default MobileLayout;
