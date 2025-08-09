import { ReactNode } from "react";
import NavigationBar from "./_components/NavigationBar";

const HeroLayout = ({children}:{children: ReactNode}) => {
  return (
    <div>
        <NavigationBar />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 mb-32">{children}</main>
    </div>
  )
}

export default HeroLayout;